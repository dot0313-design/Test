# ChatGTP 50 — GitHub Pages용 프로젝트

Vite + React + Tailwind 기반의 ChatGTP 50 데모입니다.

## 로컬 실행
```bash
npm i
npm run dev
```

## 빌드
```bash
npm run build
```

## GitHub Pages 자동 배포 (Actions)
1. 이 폴더를 새 GitHub 저장소에 푸시 (기본 브랜치: `main`)
2. `Settings → Pages`에서 **Build and deployment**가 `GitHub Actions`로 설정되어 있는지 확인
3. main에 푸시하면 자동으로 빌드/배포됩니다.
4. 배포 URL: `https://<사용자명>.github.io/<저장소명>/`

> Vite의 기본 경로(base)는 워크플로에서 자동으로 설정됩니다.
