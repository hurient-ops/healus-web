-- ==============================================================================
-- Healus DB Schema & 100 Days Dummy Data Generator (For Supabase)
-- ==============================================================================
-- 이 코드를 복사하여 Supabase 대시보드의 'SQL Editor' 탭에 붙여넣고 [Run]을 누르세요.

-- 1. 기존 테이블이 있다면 깔끔하게 삭제 (초기화 목적)
DROP TABLE IF EXISTS public.blood_glucose_logs CASCADE;
DROP TABLE IF EXISTS public.pump_logs CASCADE;

-- 2. 펌프 로그 테이블 생성 (운동 시간 및 이벤트 태그 포함)
CREATE TABLE public.pump_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pump_id TEXT DEFAULT 'DEMO-PUMP-001',
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    base_total FLOAT NOT NULL,
    eat_total FLOAT NOT NULL,
    morning_total FLOAT DEFAULT 0,
    afternoon_total FLOAT DEFAULT 0,
    evening_total FLOAT DEFAULT 0,
    append_total FLOAT DEFAULT 0,
    
    avg_cgm FLOAT DEFAULT 110.0,
    sleep_hours FLOAT DEFAULT 7.5,
    stress_level INTEGER DEFAULT 3,
    exercise_hours FLOAT DEFAULT 0.0,
    event_tags TEXT,
    
    error_count INTEGER DEFAULT 0,
    error_types TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. 혈당 로그 테이블 생성
CREATE TABLE public.blood_glucose_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    glucose_value INTEGER NOT NULL,
    tag TEXT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- RLS (Row Level Security) 설정 해제 (테스트 목적)
ALTER TABLE public.pump_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_glucose_logs DISABLE ROW LEVEL SECURITY;

-- 4. 최근 가입한 유저에게 100일 치 가상 데이터 자동 삽입
DO $$
DECLARE
    target_user_id UUID;
    curr_date DATE;
    is_weekend BOOLEAN;
    sim_base FLOAT;
    sim_eat FLOAT;
    sim_append FLOAT;
    sim_cgm FLOAT;
    sim_sleep FLOAT;
    sim_stress INT;
    sim_exercise FLOAT;
    sim_event TEXT;
BEGIN
    -- 방금 가입한(가장 최근) 사용자 ID 가져오기
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE '사용자가 없습니다. 먼저 사이트에서 회원가입을 1번 진행해주세요.';
        RETURN;
    END IF;

    -- 오늘부터 과거 100일간 하루씩 돌면서 데이터 생성
    FOR i IN 0..99 LOOP
        curr_date := (CURRENT_DATE - (i || ' days')::interval)::DATE;
        is_weekend := EXTRACT(DOW FROM curr_date) IN (0, 6);
        
        -- 가상 패턴 로직 (주말엔 늦잠, 식사량 증가, 운동 부족, 혈당 높음)
        sim_base := 10 + (random() * 2);
        
        IF is_weekend THEN
            sim_eat := 25 + (random() * 5);
            sim_append := 0;
            sim_cgm := 140 + (random() * 25);
            sim_sleep := 8.5;
            sim_stress := 2;
            sim_exercise := 0;
            -- 주말 중 20% 확률로 회식(과식) 이벤트
            IF random() > 0.8 THEN
                sim_event := '회식, 과식';
                sim_cgm := sim_cgm + 20;
            ELSE
                sim_event := NULL;
            END IF;
        ELSE
            sim_eat := 15 + (random() * 5);
            sim_append := random() * 4;
            sim_cgm := 105 + (random() * 15);
            sim_sleep := 6.0;
            sim_stress := 7 + (random() * 2)::INT;
            
            -- 평일 중 30% 확률로 야근, 40% 확률로 운동
            IF random() > 0.7 THEN
                sim_event := '야근';
                sim_sleep := 5.0;
                sim_exercise := 0;
            ELSIF random() > 0.4 THEN
                sim_event := '운동';
                sim_exercise := 1.0 + (random() * 1.5);
                sim_cgm := sim_cgm - 10;
            ELSE
                sim_event := NULL;
                sim_exercise := 0;
            END IF;
        END IF;

        -- 1) Pump Log 삽입
        INSERT INTO public.pump_logs (
            user_id, month, day, base_total, eat_total, append_total, 
            avg_cgm, sleep_hours, stress_level, exercise_hours, event_tags, created_at
        ) VALUES (
            target_user_id, 
            EXTRACT(MONTH FROM curr_date), 
            EXTRACT(DAY FROM curr_date), 
            ROUND(sim_base::numeric, 1), 
            ROUND(sim_eat::numeric, 1), 
            ROUND(sim_append::numeric, 1), 
            ROUND(sim_cgm::numeric, 1), 
            ROUND(sim_sleep::numeric, 1), 
            sim_stress, 
            ROUND(sim_exercise::numeric, 1), 
            sim_event, 
            (curr_date + time '23:59:00')
        );

        -- 2) BG Log 삽입 (하루 3번 정도 임의 기록)
        INSERT INTO public.blood_glucose_logs (user_id, glucose_value, tag, recorded_at)
        VALUES (target_user_id, ROUND((sim_cgm - 15)::numeric), '공복', (curr_date + time '07:30:00'));
        
        INSERT INTO public.blood_glucose_logs (user_id, glucose_value, tag, recorded_at)
        VALUES (target_user_id, ROUND((sim_cgm + 30)::numeric), '식후', (curr_date + time '13:00:00'));
        
        INSERT INTO public.blood_glucose_logs (user_id, glucose_value, tag, recorded_at)
        VALUES (target_user_id, ROUND(sim_cgm::numeric), '취침전', (curr_date + time '22:30:00'));

    END LOOP;
END $$;
