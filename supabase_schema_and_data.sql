-- ==============================================================================
-- Healus DB Schema & 100 Days Dummy Data Generator (For Supabase)
-- ==============================================================================
-- 이 코드를 복사하여 Supabase 대시보드의 'SQL Editor' 탭에 붙여넣고 [Run]을 누르세요.
-- RLS 경고가 나오면 반드시 "Run without RLS"를 선택하세요.

-- 1. 기존 테이블이 있다면 깔끔하게 삭제 (초기화 목적)
DROP TABLE IF EXISTS public.blood_glucose_logs CASCADE;
DROP TABLE IF EXISTS public.pump_logs CASCADE;

-- 2. 펌프 로그 테이블 생성
-- BT_LOG_REQ(0x1D), BT_LOG_INJ_QNT_REQ(0x1E), BT_EXERCISE_SET_REQ(0x13), BT_RECEPTION_SET_REQ(0x14), BT_ERR_IND(0x19) 패킷 구조 반영
CREATE TABLE public.pump_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pump_id TEXT DEFAULT 'DEMO-PUMP-001',
    date TEXT NOT NULL,          -- YYYY-MM-DD
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    base_total FLOAT NOT NULL,   -- 기초 주입량
    eat_total FLOAT NOT NULL,    -- 식사 주입량
    morning_total FLOAT DEFAULT 0,
    afternoon_total FLOAT DEFAULT 0,
    evening_total FLOAT DEFAULT 0,
    append_total FLOAT DEFAULT 0, -- 추가 주입량
    
    avg_cgm FLOAT DEFAULT 110.0,
    sleep_hours FLOAT DEFAULT 7.5,
    stress_level INTEGER DEFAULT 3,
    
    exercise_hours FLOAT DEFAULT 0.0,  -- BT_EXERCISE_SET_REQ
    reception_hours FLOAT DEFAULT 0.0, -- BT_RECEPTION_SET_REQ (회식 시간)
    event_tags TEXT,                   -- 기존 태그 (하위 호환)
    notes TEXT,                        -- 특이사항/메모
    
    error_count INTEGER DEFAULT 0,
    error_types TEXT,                  -- BT_ERR_IND (예: 주입불가, 일시정지, 1일 초과량 주입, 펌프에러 등)
    
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

-- 4. 최근 가입한 유저에게 어제 기준 100일 치 가상 데이터 자동 삽입
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
    sim_stress INTEGER;
    sim_exercise FLOAT;
    sim_reception FLOAT;
    sim_notes TEXT;
    
    sim_error_types TEXT;
    sim_error_count INTEGER;
    rand_val FLOAT;
BEGIN
    -- 가장 최근에 생성된 유저 1명의 ID를 가져옴 (테스트용)
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
        -- 혹시 기존에 들어있는 데이터가 있다면 해당 유저의 데이터만 삭제
        DELETE FROM public.pump_logs WHERE user_id = target_user_id;
        DELETE FROM public.blood_glucose_logs WHERE user_id = target_user_id;

        -- 어제(yesterday)부터 과거 100일 치 데이터 생성
        FOR i IN 1..100 LOOP
            -- i가 1일 때 '어제', i가 100일 때 100일 전
            curr_date := (CURRENT_DATE - INTERVAL '1 day') - ((i - 1) || ' days')::interval;
            
            is_weekend := EXTRACT(ISODOW FROM curr_date) IN (6, 7);
            
            -- 기본 시뮬레이션 값 설정
            sim_base := 15.0 + random() * 5.0; 
            sim_eat := 20.0 + random() * 15.0; 
            sim_append := 2.0 + random() * 8.0; 
            
            sim_sleep := 6.5 + random() * 2.5; 
            sim_stress := floor(random() * 10) + 1; 
            sim_exercise := 0.0;
            sim_reception := 0.0;
            sim_notes := NULL;
            sim_error_types := NULL;
            sim_error_count := 0;

            rand_val := random();

            -- 주말/평일 패턴 및 이벤트 설정
            IF is_weekend THEN
                sim_eat := sim_eat + 10.0; 
                sim_sleep := sim_sleep + 1.5; 
                
                -- 주말에는 운동 확률 40%
                IF rand_val < 0.4 THEN
                    sim_exercise := 1.0 + random() * 1.5;
                    sim_notes := '주말 등산 및 산책';
                END IF;
            ELSE
                sim_stress := sim_stress + 2; 
                
                -- 평일 회식 확률 15%
                IF rand_val < 0.15 THEN
                    sim_reception := 2.0 + random() * 2.0;
                    sim_eat := sim_eat + 15.0; 
                    sim_stress := sim_stress + 3;
                    sim_sleep := sim_sleep - 1.5;
                    sim_notes := '야근 후 부서 회식으로 과식함';
                -- 평일 야근 스트레스 확률 10%
                ELSIF rand_val < 0.25 THEN
                    sim_notes := '업무 스트레스 심함';
                END IF;
            END IF;

            sim_cgm := 110.0 + (sim_eat * 0.5) + (sim_stress * 1.5) - (sim_exercise * 5.0);
            
            -- 오류 데이터 시뮬레이션 (약 5% 확률로 오류 발생)
            IF random() < 0.05 THEN
                sim_error_count := 1;
                IF rand_val < 0.3 THEN
                    sim_error_types := '주입불가';
                    sim_notes := '펌프 주입불가 오류 알림 뜸';
                ELSIF rand_val < 0.6 THEN
                    sim_error_types := '일시정지';
                ELSIF rand_val < 0.8 THEN
                    sim_error_types := '1일 초과량 주입';
                    sim_notes := '일일 최대 주입량 초과 경고';
                ELSE
                    sim_error_types := '펌프에러';
                END IF;
            END IF;

            -- 펌프 로그 삽입
            INSERT INTO public.pump_logs (
                user_id, date, month, day, 
                base_total, eat_total, append_total, 
                avg_cgm, sleep_hours, stress_level, 
                exercise_hours, reception_hours, notes,
                error_count, error_types,
                created_at
            ) VALUES (
                target_user_id,
                to_char(curr_date, 'YYYY-MM-DD'),
                EXTRACT(MONTH FROM curr_date),
                EXTRACT(DAY FROM curr_date),
                ROUND(sim_base::numeric, 1),
                ROUND(sim_eat::numeric, 1),
                ROUND(sim_append::numeric, 1),
                ROUND(sim_cgm::numeric, 1),
                ROUND(sim_sleep::numeric, 1),
                sim_stress,
                ROUND(sim_exercise::numeric, 1),
                ROUND(sim_reception::numeric, 1),
                sim_notes,
                sim_error_count,
                sim_error_types,
                curr_date
            );
        END LOOP;
        
        RAISE NOTICE '100 days of dummy pump logs created successfully for user %', target_user_id;
    ELSE
        RAISE NOTICE 'No user found in auth.users table. Please sign up a user first.';
    END IF;
END $$;
