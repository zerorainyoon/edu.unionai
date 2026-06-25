# UnionAI Backend API Boilerplate

Production-Ready FastAPI + SQLModel + MariaDB + Docker Compose 기반의 고성능/고가용성 백엔드 서버 보일러플레이트 시스템입니다.

## 🛠 Tech Stack & Requirements

* **Language**: Python 3.11+
* **Framework**: FastAPI (Async/Await)
* **ORM & Validation**: SQLModel (Pydantic v2 통합)
* **Database**: MariaDB 10.11 (Dialect: `mysql+aiomysql` 비동기 풀 연동)
* **Migration**: Alembic
* **Orchestration**: Docker & Docker Compose
* **Code Format**: Black / Ruff / MyPy

---

## 📂 Project Directory Structure

```text
server/
├── backend/
│   ├── alembic/              # Async Alembic 마이그레이션 설정 및 이력 관리
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   ├── alembic.ini       # Alembic 메인 설정 파일
│   │   └── versions/         # 버전별 마이그레이션 스크립트 파일 (.py)
│   │       └── 93c1264c48bb_initial_table.py
│   ├── api/                  # API 엔드포인트 라우터 레이어
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── course.py
│   │   └── __init__.py
│   ├── core/                 # 핵심 코어 (설정, DB 엔진, 로깅 모듈, 응답 래퍼)
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── logging.py
│   │   └── response_wrapper.py
│   ├── middlewares/          # ASGI/HTTP 미들웨어
│   │   └── logging_middleware.py
│   ├── models/               # 데이터베이스 스키마 및 DTO 정의
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── course.py
│   │   └── course_registration.py
│   ├── services/             # 비즈니스 CRUD 서비스 레이어
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── course_service.py
│   ├── Dockerfile            # 경량화/보안 적용 멀티 스테이지 빌드 파일
│   └── requirements.txt      # 파이썬 의존성 패키지 관리 파일
├── .env                      # 기본 로컬 환경 설정 파일
├── .env.dev                  # 개발 환경(dev) 설정 파일
├── .env.qa                   # QA/검증 환경(qa) 설정 파일
├── .env.prod                 # 운영 환경(prod) 설정 파일
├── .env.example
├── docker-compose.yml        # 로컬 환경 오케스트레이션 구성 파일
└── pyproject.toml            # Ruff / Black / Mypy 정적 분석 린팅 설정
```

---

## ⚡ 주요 핵심 기능 및 설계 원칙

### 1. 다중 환경 파일 지원 (.env.dev, .env.qa, .env.prod)
* `ENVIRONMENT` 시스템 환경 변수(기본값: `dev`)에 따라 적절한 `.env.{ENVIRONMENT}` 파일을 자동으로 추적하여 데이터베이스 자격 증명 및 프로젝트 메타데이터를 로드합니다.
* `docker-compose.yml` 실행 시에도 `env_file: - .env.${ENVIRONMENT:-dev}` 구성을 통해 동적으로 설정 파일을 교체할 수 있습니다.

### 2. 비동기 데이터베이스 엔진 및 풀 설정 (`backend/core/db.py`)
* `mysql+aiomysql` 비동기 드라이버를 탑재하였습니다.
* 대규모 커넥션을 견딜 수 있도록 오버플로우 방지(`max_overflow=10`), 주기적 연결 초기화(`pool_recycle=1800`), 유효성 선행 검증(`pool_pre_ping=True`)이 세팅된 Connection Pool을 사용합니다.
* 안전한 시작 및 커넥션 누수 방지를 위해 FastAPI `lifespan` 관리 로직에 통합되어 서버 종료 시 비동기적으로 DB 엔진이 폐기(Dispose)됩니다.

### 3. 구조화된 JSON 로깅 & ID 추적 기능
* 일반 텍스트 포맷 대신 클라우드 수집 시스템(ELK, CloudWatch 등)에서 즉시 구조 분석이 가능한 한 줄짜리 **JSON structured log**를 콘솔로 출력합니다.
* `contextvars`를 활용하여 요청 별 고유한 `Request-ID`와 트랜잭션 추적이 가능한 `Correlation-ID`를 스레드-세이프하게 전파합니다.
* API 요청이 시작되는 순간 미들웨어가 고유 ID를 부여(또는 수신)하고, 요청이 끝날 때 HTTP 메타데이터와 소요 시간(ms)을 측정하여 JSON 형태로 기록합니다.

### 4. 무결성 예외 처리 (Global Custom Exception Handlers)
* `HTTPException`, `RequestValidationError` 및 기타 예상치 못한 전역 에러(`Exception`)에 대해 고유 커스텀 핸들러를 바인딩하였습니다.
* 사용자에게는 서버 시스템의 세부 Traceback을 마스킹하고 구조화된 에러 JSON 규격(`error: {code, message, request_id, correlation_id}`)만을 리턴하되, 서버 로그 시스템에는 상세 스택 트레이스를 JSON 형태로 완전하게 기록하여 모니터링 편의성과 보안성을 모두 잡았습니다.

---

## 🚀 실행 가이드

### 1. 환경별 Docker Compose 실행

로컬 환경에 Docker 및 Docker Compose가 설치되어 있는지 확인합니다.

```bash
# [Development] 개발 환경 빌드 및 실행
ENVIRONMENT=dev docker compose up -d --build

# [QA / Test] QA 테스트 환경 빌드 및 실행
ENVIRONMENT=qa docker compose up -d --build

# [Production] 운영 환경 빌드 및 실행
ENVIRONMENT=prod docker compose up -d --build
```

실행 시 `docker-compose.yml` 설정에 의해 데이터베이스(MariaDB) 컨테이너가 헬스체크를 통과하면, 백엔드 애플리케이션 컨테이너가 구동되기 전 자동으로 `alembic upgrade head` 명령을 실행해 최신 데이터베이스 마이그레이션을 안전하게 적용합니다.

### 2. 컨테이너 실시간 로그 확인
```bash
docker compose logs -f
```

### 3. Swagger API 문서 확인
서버 가동 후 아래 주소를 통해 대화형 OpenAPI 스펙을 테스트하실 수 있습니다.
* **OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative Docs (Redoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 4. 로컬 구문 컴파일 테스트
실행 환경이 구축된 로컬 머신에서 파이썬 문법 에러 및 정적 구문을 테스트하려면 다음 커맨드를 수행합니다.
```bash
python3 -m py_compile backend/*.py backend/**/*.py backend/api/**/*.py
```
