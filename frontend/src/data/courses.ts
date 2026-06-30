export interface Course {
  id: string;
  title: string;
  tags: string[];
  duration: string;
  applyPeriod: string;
  location: string;
  fee: string;
  status: '모집중' | '마감임박' | '모집마감';
  gradientFrom: string;
  gradientTo: string;

  // Categorization property
  type: 'sesac' | 'k-newdeal' | 'kdt';

  // Detailed attributes for view page
  institution: string;
  hours: string;
  feeOriginal: string;
  refundInfo: string;
  introHours: string;
  introLocation: string;
  introPreparation: string[];
  recommendedRoles: string[];
  curriculum: {
    moduleName: string;
    unitName: string;
    topics: string[];
  }[];

  // Raw date fields from backend API
  apply_start_date?: string;
  apply_end_date?: string;
  edu_start_date?: string;
  edu_end_date?: string;
}

const GRADIENTS = [
  { from: '#4F46E5', to: '#06B6D4' }, // Indigo -> Cyan
  { from: '#3B82F6', to: '#8B5CF6' }, // Blue -> Purple
  { from: '#10B981', to: '#059669' }, // Emerald
  { from: '#F59E0B', to: '#D97706' }, // Amber
  { from: '#EF4444', to: '#DC2626' }, // Red
  { from: '#EC4899', to: '#BE185D' }, // Pink
  { from: '#06B6D4', to: '#0891B2' }, // Cyan
  { from: '#8B5CF6', to: '#6D28D9' }, // Purple
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: '[K-Digital Training] 생성형 AI 모델 기반의 풀스택 웹 개발자 양성 과정',
    tags: ['국비지원', '선착순', '취업연계'],
    duration: '2026.07.20 ~ 2026.12.28',
    applyPeriod: '2026.06.01 ~ 2026.07.15',
    location: '서울 / 서울IT교육원',
    fee: '무료 (전액 국비 지원)',
    status: '모집중',
    gradientFrom: GRADIENTS[0].from,
    gradientTo: GRADIENTS[0].to,
    type: 'kdt',
    institution: '서울IT인재개발원',
    hours: '840시간 (총 120일)',
    feeOriginal: '9,820,000원',
    refundInfo: '내일배움카드 발급 시 전액 정부 지원 (개인 자부담 0원)',
    introHours: '09:00 ~ 18:00 (월~금, 일 8시간, 주 40시간)',
    introLocation: '서울특별시 마포구 백범로 31 서울IT인재개발원 3층 제2강의실',
    introPreparation: ['개인 필기도구', '노트북 지참 권장 (사양: i5 이상, RAM 16GB 권장)', '신분증 (첫날 본인 확인용)'],
    recommendedRoles: ['웹 풀스택 개발자', '생성형 AI 응용 소프트웨어 엔지니어', '클라우드 연동 웹 개발자'],
    curriculum: [
      {
        moduleName: '프론트엔드 핵심 기술',
        unitName: 'React & Tailwind 기반 웹 UI 개발',
        topics: ['HTML5/CSS3 및 모던 JavaScript ES6+', 'React 컴포넌트 아키텍처 및 상태 관리(Redux/Zustand)', 'Tailwind CSS 활용 반응형 레이아웃 설계', 'Vite 빌드 도구 및 웹팩 환경 구성']
      },
      {
        moduleName: '백엔드 아키텍처 구축',
        unitName: 'Node.js & Express 서버 개발',
        topics: ['RESTful API 설계 및 Express 프레임워크 구현', 'PostgreSQL/MongoDB 데이터베이스 모델링 및 ORM(Prisma) 연동', 'JWT 기반 사용자 인증 및 보안 세션 처리', 'Docker 컨테이너 활용 애플리케이션 가상화']
      },
      {
        moduleName: '생성형 AI 모델 융합',
        unitName: 'LLM API 연동 및 AI 웹 서비스 구현',
        topics: ['OpenAI / HuggingFace API 활용 프롬프트 엔지니어링', 'LangChain 활용 RAG(검색증강생성) 시스템 아키텍처 설계', 'Vector DB(Pinecone/ChromaDB) 연동 및 문서 임베딩', '실시간 AI 챗봇 및 자동 요약 웹 서비스 배포']
      }
    ]
  },
  {
    id: '2',
    title: '[K-Digital Academy] AWS 클라우드 아키텍처 및 DevSecOps 엔지니어 육성',
    tags: ['국비지원', '대기업참여', '온오프병행'],
    duration: '2026.08.03 ~ 2027.01.29',
    applyPeriod: '2026.06.10 ~ 2026.07.25',
    location: '경기 / 수원이동센터',
    fee: '무료 (전액 국비 지원)',
    status: '모집중',
    gradientFrom: GRADIENTS[1].from,
    gradientTo: GRADIENTS[1].to,
    type: 'kdt',
    institution: '경기인재개발센터',
    hours: '960시간 (총 120일)',
    feeOriginal: '11,200,000원',
    refundInfo: 'K-Digital 훈련비 지원을 통해 자부담 없이 전액 지원',
    introHours: '09:00 ~ 18:00 (월~금, 온/오프라인 병행 훈련)',
    introLocation: '경기도 수원시 영통구 광교로 107 경기인재개발센터 4층 메인홀',
    introPreparation: ['노트북 필참 (Intel i7/M1 이상, RAM 16GB 필수)', 'AWS 계정 (실습용 크레딧 제공 예정)', 'SSH 클라이언트 사전 설치'],
    recommendedRoles: ['Cloud Architect', 'DevOps/DevSecOps Engineer', 'System Administrator'],
    curriculum: [
      {
        moduleName: 'AWS 클라우드 기초 및 설계',
        unitName: 'AWS 핵심 서비스 인프라 구축',
        topics: ['VPC 네트워크 토폴로지 설계 및 보안 그룹 설정', 'EC2, RDS, S3 스토리지 연동 및 탄력적 부하 분산(ALB)', 'IAM 사용자 권한 관리 및 세부 보안 규정 설정']
      },
      {
        moduleName: 'IaC 및 CI/CD 자동화',
        unitName: 'Terraform 및 GitHub Actions 파이프라인',
        topics: ['Terraform 코드를 활용한 인프라스트럭처 선언(IaC)', 'Ansible 프로비저닝 자동화', 'GitHub Actions / Jenkins 기반 지속적 통합 및 배포 파이프라인']
      },
      {
        moduleName: 'DevSecOps & 컨테이너 보안',
        unitName: 'Kubernetes 및 보안 감사 자동화',
        topics: ['Docker 및 Amazon EKS 기반 마이크로서비스 배포', 'SonarQube 소스 코드 정적 분석 및 취약점 진단', 'AWS CloudTrail 및 GuardDuty 활용 위협 탐지']
      }
    ]
  },
  {
    id: '3',
    title: '[SeSAC] 로봇 자율주행(SLAM/Navigation) 제어 소프트웨어 전문인력 과정',
    tags: ['SeSAC(새싹)', '청년취업사관학교', '포트폴리오', '실습장비지원'],
    duration: '2026.07.10 ~ 2026.12.18',
    applyPeriod: '2026.05.20 ~ 2026.07.05',
    location: '부산 / 부산상공회의소',
    fee: '무료 (전액 국비 지원)',
    status: '마감임박',
    gradientFrom: GRADIENTS[2].from,
    gradientTo: GRADIENTS[2].to,
    type: 'sesac',
    institution: '부산상공회의소 인재개발센터',
    hours: '800시간 (총 100일)',
    feeOriginal: '8,500,000원',
    refundInfo: '지역 산업 특화 고용 지원을 통한 전액 무료 과정',
    introHours: '09:00 ~ 17:00 (월~금, 일 7시간)',
    introLocation: '부산광역시 진구 황령대로 24 부산상공회의소 4층 제3전산실',
    introPreparation: ['C/C++ 기본 문법 사전 학습 필수', '실습용 아두이노/라즈베리파이 키트 제공'],
    recommendedRoles: ['임베디드 소프트웨어 개발자', 'ROS 로봇 제어 엔지니어', '자율주행 차량 시스템 설계자'],
    curriculum: [
      {
        moduleName: 'C++ 및 펌웨어 개발 기초',
        unitName: '마이크로컨트롤러(MCU) 및 리눅스 시스템 기초',
        topics: ['C/C++ 심화 문법 및 데이터 구조', 'GPIO, UART, I2C, SPI 통신 프로토콜 매핑', '임베디드 리눅스 커널 빌드 및 디바이스 드라이버 프로그래밍']
      },
      {
        moduleName: 'ROS 로봇 운영체제 실무',
        unitName: 'ROS2 기반 노드 통신 및 시뮬레이션',
        topics: ['ROS2 기본 개념 및 퍼블리셔/서브스크라이버 통신 설계', 'Gazebo 물리 시뮬레이터 활용 로봇 환경 매핑', 'URDF 로봇 모델링 및 로봇 제어 알고리즘 구현']
      },
      {
        moduleName: '자율주행 슬램 및 모빌리티 프로젝트',
        unitName: 'SLAM/Navigation2 및 센서 융합',
        topics: ['LiDAR, IMU, 카메라 센서 데이터 수집 및 노이즈 필터링', 'SLAM 알고리즘 활용 실시간 지도 작성 및 경로 계획', '실제 미니 자율주행 차량(RC Car) 탑재 제어 종합 프로젝트']
      }
    ]
  },
  {
    id: '4',
    title: '[K-Digital Training] PLC/SCADA 기반의 스마트 팩토리 제어 엔지니어 양성 과정',
    tags: ['국비지원', '산업체연계', '실무중심'],
    duration: '2026.07.25 ~ 2026.11.30',
    applyPeriod: '2026.06.01 ~ 2026.07.20',
    location: '인천 / 인천인재교육원',
    fee: '무료 (훈련수당 지급)',
    status: '모집중',
    gradientFrom: GRADIENTS[3].from,
    gradientTo: GRADIENTS[3].to,
    type: 'kdt',
    institution: '인천상공회의소 인재개발원',
    hours: '680시간 (총 85일)',
    feeOriginal: '7,200,000원',
    refundInfo: '내일배움카드 국가기간전략산업 직종 전액 지원 및 매월 훈련수당 지급',
    introHours: '09:00 ~ 18:00 (월~금, 일 8시간)',
    introLocation: '인천광역시 남동구 남동대로 215 인천상공회의소 2층 하이브리드룸',
    introPreparation: ['노트북 대여 가능', '기초 엑셀 및 통계 개념 이해'],
    recommendedRoles: ['스마트 팩토리 공정 제어 관리자', '제조 데이터 분석 전문가', '생산 설비 자동화 분석원'],
    curriculum: [
      {
        moduleName: '스마트 팩토리 및 자동화 개요',
        unitName: '제조 실행 시스템(MES) 및 산업 통신',
        topics: ['스마트 팩토리 구조와 구성 요소', 'MES/ERP 시스템을 활용한 생산 정보 흐름 파악', 'OPC UA 및 Modbus 통신 규격 실습']
      },
      {
        moduleName: 'PLC 및 데이터 수집 실무',
        unitName: '산업용 센서 연동 및 PLC 데이터 전송',
        topics: ['LS산전/지멘스 PLC 래더 다이어그램 프로그래밍', '시리얼/이더넷 통신 기반 센서 데이터 계측', 'Edge Gateway 활용 라즈베리파이 연동 데이터 수집']
      },
      {
        moduleName: '제조 빅데이터 분석 및 시각화',
        unitName: 'Python 데이터 분석 및 BI 대시보드',
        topics: ['Pandas/Numpy 활용 센서 시계열 데이터 전처리', '불량 원인 규명 및 예지 보전을 위한 이상 탐지 모델 학습', 'Tableau/Grafana 활용 실시간 생산 현황 대시보드 구현']
      }
    ]
  },
  {
    id: '5',
    title: '[K-Digital Training] 대용량 빅데이터 파이프라인 구축 및 플랫폼 엔지니어 양성',
    tags: ['국비지원', '빅데이터실습', '취업100%연계'],
    duration: '2026.05.15 ~ 2026.10.20',
    applyPeriod: '2026.04.01 ~ 2026.05.10',
    location: '서울 / 세종센터',
    fee: '무료 (전액 정부 지원)',
    status: '모집마감',
    gradientFrom: GRADIENTS[4].from,
    gradientTo: GRADIENTS[4].to,
    type: 'kdt',
    institution: '서울중앙인재개발센터',
    hours: '800시간 (총 100일)',
    feeOriginal: '9,100,000원',
    refundInfo: '모집이 종료된 교육 과정으로 추가 환급 및 신청이 불가능합니다.',
    introHours: '09:00 ~ 18:00 (월~금, 일 8시간)',
    introLocation: '서울특별시 종로구 세종대로 189 세종빌딩 6층 교육본부',
    introPreparation: ['교육 종료 과정으로 준비물 해당 없음'],
    recommendedRoles: ['데이터 엔지니어', '빅데이터 플랫폼 아키텍트', 'ETL 개발자'],
    curriculum: [
      {
        moduleName: '빅데이터 인프라 핵심',
        unitName: 'Hadoop 분산 파일 시스템 및 Linux 관리',
        topics: ['리눅스 시스템 명령어 및 네트워크 튜닝', 'HDFS 분산 아키텍처 개념 및 클러스터 다중 구성', 'MapReduce 기반 분산 처리 알고리즘 구현']
      },
      {
        moduleName: '실시간 스트리밍 분석',
        unitName: 'Spark 및 Kafka 활용 데이터 파이프라인',
        topics: ['Apache Kafka 활용 이벤트 기반 스트리밍 데이터 수집', 'Spark Streaming 활용 실시간 인메모리 데이터 연산', 'NoSQL DB(Cassandra, HBase) 연동 및 로깅 설계']
      },
      {
        moduleName: '클라우드 데이터 레이크',
        unitName: 'AWS Glue 및 Athena 활용 데이터 분석',
        topics: ['대용량 데이터 클라우드 적재 및 ETL 자동화', 'SQL 및 HiveQL 활용 대용량 파일 질의 최적화', '종합 빅데이터 파이프라인 구축 및 데이터 엔지니어링 프로젝트']
      }
    ]
  },
  {
    id: '6',
    title: '[SeSAC] Flutter 하이브리드 앱 개발 및 서비스 출시 포트폴리오 완성반',
    tags: ['새싹과정', '단기완성', '스토어등록지원'],
    duration: '2026.07.15 ~ 2026.09.30',
    applyPeriod: '2026.06.05 ~ 2026.07.10',
    location: '전국 / 온라인 훈련관',
    fee: '무료 (교재 무상 지원)',
    status: '모집중',
    gradientFrom: GRADIENTS[5].from,
    gradientTo: GRADIENTS[5].to,
    type: 'sesac',
    institution: '대한상공회의소 스마트훈련관',
    hours: '320시간 (총 40일)',
    feeOriginal: '3,800,000원',
    refundInfo: '원격 디지털 신기술 훈련 카드로 100% 국비 환급 지원',
    introHours: '13:00 ~ 19:00 (월~금, 하루 6시간 원격 동영상 및 라이브 코칭)',
    introLocation: '비대면 원격 교육 플랫폼 (메타버스 게더타운 클래스룸)',
    introPreparation: ['인터넷 연결이 원활한 PC 및 웹캠 필수', 'Flutter SDK 및 Android Studio 사전 설치 가이드 제공', '맥북 소지자 iOS 빌드 테스트 가능 (없어도 에뮬레이터 실습 가능)'],
    recommendedRoles: ['Android / iOS 앱 개발자', '크로스플랫폼 앱 기획자', '스타트업 앱 원맨 개발자'],
    curriculum: [
      {
        moduleName: 'Dart 프로그래밍 핵심',
        unitName: 'Dart 언어 특징 및 비동기 처리',
        topics: ['객체지향 Dart 문법 및 Null Safety 이해', 'Future, Stream 활용 비동기 프로그래밍', 'JSON 파싱 및 HTTP 클라이언트 통신 기초']
      },
      {
        moduleName: 'Flutter 위젯 아키텍처',
        unitName: '반응형 UI 설계 및 상태 관리 패턴',
        topics: ['기본 머티리얼/쿠퍼티노 디자인 위젯 활용 UI 제작', 'Provider 및 Riverpod 기반 상태 관리 라이브러리 연동', '내비게이션 및 다국어 지원, 기기 센서 권한 제어']
      },
      {
        moduleName: '앱 마켓 출시 및 배포',
        unitName: '백엔드 연동 및 파이어베이스 통합',
        topics: ['Firebase Auth, Firestore, Cloud Messaging 연동', 'CI/CD 도구(Codemagic) 활용 구글 플레이스토어/앱스토어 패키지 빌드', '애드몹 광고 탑재 및 하이브리드 종합 앱 출시 포트폴리오 완성']
      }
    ]
  },
  {
    id: '7',
    title: '[K-Digital Academy] 대규모 언어 모델(LLM) 기반의 비즈니스 서비스 기획 전문가',
    tags: ['국비지원', 'AI기획', '멘토링제공', 'K-Digital'],
    duration: '2026.08.10 ~ 2026.12.31',
    applyPeriod: '2026.06.15 ~ 2026.08.05',
    location: '서울 / 대한상의 본부',
    fee: '무료 (전액 국비 지원)',
    status: '모집중',
    gradientFrom: GRADIENTS[6].from,
    gradientTo: GRADIENTS[6].to,
    type: 'kdt',
    institution: '대한상공회의소 본부 교육원',
    hours: '640시간 (총 80일)',
    feeOriginal: '7,800,000원',
    refundInfo: '내일배움카드 전액 100% 무료 수강 (교재 및 급식 무료 제공)',
    introHours: '09:00 ~ 18:00 (월~금, 주 40시간)',
    introLocation: '서울특별시 중구 세종대로 39 대한상공회의소 회관 4층 대회의실 교육장',
    introPreparation: ['노트북 지참 (i5, RAM 16GB 이상 권장)', '파이썬 및 마케팅 기획 기초 지식 권장'],
    recommendedRoles: ['AI 비즈니스 기획자', 'LLM 기반 솔루션 PM/PO', 'AI 에이전트 서비스 디자이너'],
    curriculum: [
      {
        moduleName: 'AI 비즈니스 및 LLM 기초',
        unitName: '생성형 AI 생태계 이해 및 프롬프트 기획',
        topics: ['LLM 기술 동향 (GPT-4, Claude, LLaMA 등)', '구조적 프롬프트 엔지니어링 설계 기법', 'AI 비즈니스 모델 발굴 및 시장 분석 방법론']
      },
      {
        moduleName: 'LLM 파인튜닝 실무 실습',
        unitName: '데이터 전처리 및 LoRA/QLoRA 학습',
        topics: ['허깅페이스 데이터셋 활용 파인튜닝 데이터 전처리', 'Google Colab/A100 GPU 활용 가벼운 LLM 모델 미세조정', '파인튜닝 모델의 성능 평가 지표 수치화 기법']
      },
      {
        moduleName: 'AI 에이전트 솔루션 기획',
        unitName: 'RAG 기술 기획 및 UI/UX 설계',
        topics: ['임베딩 벡터화 및 지식 베이스 설계 기획', 'LangChain/AutoGPT 기반 멀티에이전트 시나리오 설계', 'AI 서비스 프로토타이핑(Figma, Streamlit) 및 기획서 완성']
      }
    ]
  },
  {
    id: '8',
    title: '[SeSAC] PLC 자동화 회로설계 및 산업용 다관절 로봇 제어 엔지니어 과정',
    tags: ['새싹훈련', '현장실습', '수당지급', '협약기업채용', '새싹'],
    duration: '2026.07.18 ~ 2026.12.22',
    applyPeriod: '2026.06.01 ~ 2026.07.12',
    location: '광주 / 광주인재원',
    fee: '무료 (훈련 기기 대여)',
    status: '마감임박',
    gradientFrom: GRADIENTS[7].from,
    gradientTo: GRADIENTS[7].to,
    type: 'sesac',
    institution: '광주상공회의소 인재개발센터',
    hours: '720시간 (총 90일)',
    feeOriginal: '8,200,000원',
    refundInfo: '국가 공인 스마트제조 고용지원 100% 전액 환급 무료 수강',
    introHours: '09:00 ~ 17:30 (월~금, 일 7.5시간)',
    introLocation: '광주광역시 서구 대남대로 465 광주상공회의소 지하1층 로봇실습장',
    introPreparation: ['실습 작업복 및 안전화 제공', '개인 필기도구'],
    recommendedRoles: ['PLC 제어 프로그래머', '산업용 로봇 유지보수 엔지니어', '스마트팩토리 설비 설계원'],
    curriculum: [
      {
        moduleName: '시퀀스 제어 및 PLC 기초',
        unitName: 'PLC 기본 명령어 및 결선 설계',
        topics: ['전기 회로 기초 및 릴레이 시퀀스 분석', 'PLC 입출력 모듈 하드웨어 결선 실습', '기본 래더 명령어 활용 모터 기동 및 공압 실린더 제어']
      },
      {
        moduleName: '산업용 로봇 핸들링 실습',
        unitName: '다관절 로봇 티칭 및 좌표 제어',
        topics: ['산업용 다관절 로봇 구조 및 수동 운전(Teaching)', '로봇 프로그래밍 기초 및 Pick & Place 작업 설계', '비전 센서 카메라 연동 로봇 얼라인 실습']
      },
      {
        moduleName: '공정 자동화 종합 설계',
        unitName: 'HMI 화면 설계 및 종합 제어 프로젝트',
        topics: ['HMI(XGT Panel/Touch) 작화 및 모니터링 화면 구성', '로봇 - PLC - HMI 이더넷 네트워크 종합 연동 설계', '컨베이어 이송 시스템 및 부품 분류 자동화 라인 프로젝트 완성']
      }
    ]
  }
];
