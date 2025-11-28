---
title: '블로그에 오신 것을 환영합니다'
date: 2025-01-26
tags: ["Welcome", "Blog"]
category: 'General'
description: '첫 번째 블로그 게시글입니다. GitHub Pages로 구축한 정적 블로그를 소개합니다.'
---

# 블로그에 오신 것을 환영합니다! 👋

안녕하세요! **jaykimdevop**의 개발 블로그에 오신 것을 환영합니다.

이 블로그는 GitHub Pages를 활용한 정적 블로그로, 순수 HTML, CSS, JavaScript만으로 구축되었습니다.

## ✨ 주요 기능

이 블로그는 다음과 같은 기능들을 제공합니다:

- **마크다운 지원**: 게시글은 마크다운으로 작성됩니다
- **다크/라이트 모드**: 테마 전환 버튼으로 모드를 변경할 수 있습니다
- **코드 하이라이팅**: Prism.js를 사용한 문법 강조
- **검색 기능**: 게시글 제목, 내용, 태그로 검색 가능
- **태그 필터링**: 태그별로 게시글을 필터링
- **Giscus 댓글**: GitHub Discussions 기반 댓글 시스템

## 💻 코드 예시

JavaScript 코드를 작성하면 이렇게 표시됩니다:

```javascript
// Hello World 예제
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to my blog, ${name}`;
}

greet('visitor');
```

Python 코드도 지원합니다:

```python
# 간단한 함수 예제
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 피보나치 수열 출력
for i in range(10):
    print(fibonacci(i), end=' ')
```

## 📝 마크다운 문법

### 인용문

> 이것은 인용문입니다.
> 여러 줄로 작성할 수 있습니다.

### 목록

**순서 없는 목록:**
- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

**순서 있는 목록:**
1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

### 표

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 | 게시글 작성 | ✅ |
| 테마 | 다크/라이트 모드 | ✅ |
| 검색 | 클라이언트 사이드 검색 | ✅ |
| 댓글 | Giscus 통합 | ✅ |

## 🚀 시작하기

새 게시글을 작성하려면 `pages/` 폴더에 마크다운 파일을 생성하세요:

```markdown
---
title: '게시글 제목'
date: 2025-01-26
tags: ["태그1", "태그2"]
category: '카테고리'
description: '게시글 설명'
---

# 본문 시작

내용을 작성하세요...
```

파일을 생성하고 `git push`하면 GitHub Actions가 자동으로 배포합니다!

---

감사합니다. 앞으로 다양한 개발 관련 글을 공유하겠습니다. 🙏

