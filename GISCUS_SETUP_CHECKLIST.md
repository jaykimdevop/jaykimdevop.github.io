# Giscus 댓글 시스템 설정 체크리스트

## ✅ 필수 확인 사항

### 1. GitHub Discussions 활성화 (가장 중요!)
1. https://github.com/jaykimdevop/jaykimdevop.github.io/settings 접속
2. 왼쪽 메뉴에서 **General** 클릭
3. **Features** 섹션으로 스크롤
4. **Discussions** 체크박스가 **체크되어 있는지** 확인
5. 체크되어 있지 않으면 체크하고 **Save changes** 클릭

### 2. Giscus 앱 설치 및 권한 확인
1. https://github.com/settings/installations 접속
2. **giscus** 앱 찾기
3. **Configure** 클릭
4. **Repository access** 섹션 확인:
   - `jaykimdevop/jaykimdevop.github.io`가 포함되어 있는지 확인
   - 없다면 **Only select repositories** 선택
   - `jaykimdevop/jaykimdevop.github.io` 추가
   - **Save** 클릭

### 3. 저장소가 Public인지 확인
1. https://github.com/jaykimdevop/jaykimdevop.github.io/settings 접속
2. **General** > **Danger Zone** 섹션 확인
3. 저장소가 **Public**인지 확인
4. Private이면 Public으로 변경 필요 (GitHub Pages는 Public이어야 함)

### 4. Giscus 설정 재확인
1. https://giscus.app/ko 접속
2. **저장소** 입력: `jaykimdevop/jaykimdevop.github.io`
3. 다음 설정 확인:
   - **페이지 ↔️ Discussions 매핑**: `pathname` 또는 `Discussion title contains page URL`
   - **Discussion 카테고리**: `General`
   - **기능**: 메인 포스트에 반응 남기기 활성화
4. 생성된 코드의 `data-repo-id`와 `data-category-id` 확인
5. 현재 코드와 일치하는지 확인

## 🔧 추가 설정 (필요시)

### giscus.json 파일 생성 (고급 설정)
저장소 루트에 `giscus.json` 파일을 생성하여 도메인 허용:

```json
{
  "origins": [
    "https://jaykimdevop.github.io"
  ],
  "originsRegex": [
    "http://localhost:[0-9]+"
  ]
}
```

## 🐛 문제 해결

### "Unable to create discussion" 에러가 계속 발생하면:

1. **브라우저 콘솔 확인** (F12):
   - 에러 메시지 확인
   - 404 또는 400 에러인지 확인

2. **GitHub Discussions 수동 생성 테스트**:
   - https://github.com/jaykimdevop/jaykimdevop.github.io/discussions 접속
   - 수동으로 Discussion을 생성할 수 있는지 확인
   - 생성할 수 없다면 Discussions가 활성화되지 않은 것

3. **Giscus 앱 재설치**:
   - https://github.com/settings/installations
   - giscus 앱 제거 후 재설치

## 📝 확인 순서

1. ✅ Discussions 활성화 확인
2. ✅ Giscus 앱 설치 및 권한 확인
3. ✅ 저장소 Public 확인
4. ✅ Giscus 설정 재확인
5. ✅ 배포 완료 대기 (5-10분)
6. ✅ 브라우저 캐시 삭제 (Ctrl+Shift+R)
7. ✅ 댓글 작성 테스트
