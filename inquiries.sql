-- 고객센터 1:1 문의 내역을 저장할 테이블
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 비회원 문의 가능성 대비 NULL 허용
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT '대기중', -- 대기중, 처리중, 완료
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정 (관리자 또는 서비스 역할만 접근 가능하게 하고 클라이언트는 API를 통해 삽입)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 서비스 역할(서버리스 API)에서는 모두 접근 가능
CREATE POLICY "Enable all for service_role"
ON public.inquiries
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');
