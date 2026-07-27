-- ==============================================================================
-- Healus DB: 오늘 날짜 데이터 (단건) 수동 삽입 스크립트
-- ==============================================================================
-- 펌프 앱(healus 앱)에서 동기화될 때 사용될 쿼리 구조와 동일합니다.

DO $$
DECLARE
    target_user_id UUID;
    curr_date DATE := CURRENT_DATE; -- 오늘 날짜
BEGIN
    -- 가장 최근에 가입한 테스트 유저 ID 가져오기 (원하는 유저 ID가 있다면 수동 교체)
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
        -- 혹시 오늘 데이터가 이미 있다면 삭제 (중복 방지)
        DELETE FROM public.pump_logs 
        WHERE user_id = target_user_id AND date = to_char(curr_date, 'YYYY-MM-DD');

        -- 오늘(Today) 데이터 삽입
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
            18.5,     -- 기초 주입량 (예시)
            35.0,     -- 식사 주입량 (예시)
            5.0,      -- 추가 주입량 (예시)
            120.5,    -- 평균 혈당
            8.0,      -- 수면 시간
            4,        -- 스트레스 지수
            1.5,      -- 운동 시간 (BT_EXERCISE_SET_REQ)
            0.0,      -- 회식 시간 (BT_RECEPTION_SET_REQ)
            '오늘은 운동을 열심히 해서 기분이 좋음', -- 특이사항 메모
            0,        -- 에러 발생 횟수 (BT_ERR_IND)
            NULL,     -- 에러 종류
            curr_date
        );
        
        RAISE NOTICE 'Today (%) data successfully inserted for user %', curr_date, target_user_id;
    ELSE
        RAISE NOTICE 'No user found in auth.users table.';
    END IF;
END $$;
