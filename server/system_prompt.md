# [Prompt] Production-Ready FastAPI + SQLModel + MariaDB Boilerplate Generator

## 1. Context & Goal (목적 및 배경)
우리는 **FastAPI, SQLModel, MariaDB, Docker Compose**를 기반으로 한 프로덕션(운영) 환경 수준의 백엔드 서버 인프라 및 보일러플레이트 코드를 구축하려고 합니다. 단순한 기능 구현을 넘어, 대규모 트래픽과 모니터링 환경을 견딜 수 있도록 높은 수준의 보안, 가시성(Logging), 그리고 모듈화된 Clean Architecture 구조를 지향합니다.

이 프롬프트에 명시된 지침과 제약 조건을 100% 준수하여, 즉시 배포 및 실행 가능한 완전한 소스 코드를 생성해 주세요.

---

## 2. Technical Stack & Version Constraints (기술 스택 및 버전)
* **Language**: Python 3.11 이상 (모든 코드에 **Type Hint 100% 적용**)
* **Framework**: FastAPI (Async/Await 기반 비동기 아키텍처 적용)
* **ORM & Validation**: SQLModel 최신 버전 (Pydantic v2 기반의 데이터 검증 통합)
* **Database**: MariaDB (Async 드라이버 활용, Connection Pool 최적화 설정 필수)
* **Migration**: Alembic (데이터베이스 스키마 이력 관리 및 컨테이너 연동)
* **Code Quality**: `Ruff`, `Black`, `MyPy` 정적 분석 및 포맷팅 기준을 통과할 수 있는 코드 스타일 준수

---

## 3. Production Quality Constraints (운영 환경 수준의 핵심 제약 조건)

### [A] Advanced JSON Logging & Tracing (로깅 및 모니터링)
* **표준 로깅 대신 구조화 JSON Logging 구현**: 모든 로그 출력은 중앙 집중식 수집 시스템(ELK, CloudWatch 등)에서 즉시 파싱할 수 있도록 한 줄 형태의 구조화된 JSON 포맷이어야 합니다.
* **Context 기반 ID 추적**: `contextvars`를 활용하여 API 요청마다 고유한 `Request-ID`와 상위 트랜잭션 추적이 가능한 `Correlation-ID`를 관리해야 합니다.
* **Trace ID 지원 구조**: 향후 APM 및 OpenTelemetry 분산 추적 연동이 가능하도록 Trace Context 필드를 확장할 수 있는 인터페이스 구조를 반영해야 합니다.

### [B] Architectural & Security Principles (설계 원칙 및 보안)
* **Clean Architecture & SOLID 원칙**: 각 레이어(API, Service, DB) 간의 결합도를 낮추고 의존성 주입(`Depends`)을 적극 활용하여 독립적으로 테스트 가능한 구조를 만드세요.
* **보안 취약점 최소화**: 데이터베이스 비밀번호, 시크릿 키 등 민감한 정보는 `pydantic-settings`를 통해 `.env` 파일에서 로드하며, 절대 코드 내에 하드코딩하지 마십시오.
* **완벽한 예외 처리**: 전역 JSON 예외 처리기(Global Exception Handler)를 두고, 예외 발생 시 로그에는 에러 스택과 추적 ID를 JSON으로 남기되, 사용자에게는 구조화된 에러 응답 포맷만 반환하세요.

---

## 4. Output Requirements (상세 출력 요구사항)
지면상 축약하거나 '이하 생략' 처리하지 말고, 각 파일의 완전한 코드를 순서대로 출력해 주세요.

### 4.1. Project Directory Structure
운영 환경에 적합하도록 정렬된 디렉토리 트리 구조를 시각적으로 보여주세요.
* 구조 예시: `app/core/`, `app/api/`, `app/services/`, `app/models/`, `app/middlewares/`, `alembic/`

### 4.2. Advanced JSON Logger & Context (`app/core/logging.py`)
`contextvars` 기반으로 Request/Correlation ID를 컨텍스트 내에서 스레드-세이프하게 관리하고, 표준 로그 이벤트를 JSON 포맷으로 변환하여 콘솔에 출력하는 로깅 유틸리티 코드를 작성해 주세요.

### 4.3. Tracing & Logging Middleware (`app/middlewares/logging_middleware.py`)
모든 HTTP 요청의 헤더에서 `X-Correlation-ID` 및 `X-Request-ID`를 추출(없으면 자동 생성)하여 ContextVar에 저장하고, 요청 처리 시간(ms)과 HTTP 메타데이터를 포함하여 요청/응답 시점에 JSON 로그를 남기는 비동기 미들웨어를 구현해 주세요.

### 4.4. Configuration & Database Lifecycle (`app/core/config.py`, `app/core/db.py`)
* Pydantic Settings 기반의 환경 변수 관리 클래스 및 `.env.example` 파일 예시.
* `pool_size`, `max_overflow`, `pool_recycle` 설정이 포함된 비동기 MariaDB 엔진 및 세션 생성기 코드.
* FastAPI `lifespan` 이벤트를 이용한 안전한 DB Connection Pool 시작 및 종료 관리 코드.

### 4.5. SQLModel Schemas & API Components (User 예시)
* **`app/models/user.py`**: DB 테이블용 엔티티 모델과 API 요청(Create)/응답(Response)용 DTO 모델을 엄격히 분리하여 작성.
* **`app/services/user_service.py`**: 의존성 주입을 통해 비동기 DB 세션을 받아 비즈니스 로직 및 CRUD를 처리하는 서비스 클래스.
* **`app/api/v1/user.py`**: Swagger/OpenAPI 문서가 자동 생성되도록 요약 및 설명(docstring)이 포함된 비동기 라우터 엔드포인트 코드를 구현.

### 4.6. Application Entrypoint (`app/main.py`)
CORS 설정, 전역 커스텀 JSON 예외 처리기 등록, 로깅 미들웨어 체인 구성, 그리고 API 라우터 셋업을 취합한 메인 애플리케이션 진입점 코드를 작성해 주세요.

### 4.7. DevOps & Orchestration (`Dockerfile`, `docker-compose.yml`)
* **Dockerfile**: `python:3.11-slim` 기반으로 빌드 스테이지와 실행 스테이지를 분리하고, 보안을 위해 `non-root` 유저를 생성하여 구동하는 멀티 스테이지 파일.
* **docker-compose.yml**: `web`(FastAPI)과 `db`(MariaDB) 서비스 간의 종속성 제어(Healthcheck 가동 후 web 기동), 볼륨 마운트, 네트워크 격리가 완벽히 적용된 파일.
* **Migration Guide**: 컨테이너가 가동될 때 `alembic upgrade head`가 안전하게 실행되도록 연동하는 진입점 가이드 스크립트 또는 명령어 명시.

---
지침을 완벽히 숙지했다면, 실제 기업의 배포 파이프라인에 즉시 투입할 수 있는 가장 정교하고 완성도 높은 코드를 출력해 주세요.