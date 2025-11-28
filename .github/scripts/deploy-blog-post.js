/**
 * 블로그 포스트 자동 배포 스크립트
 * 마크다운 파일 작성 후 자동으로 git add, commit, push를 수행합니다.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 작업 디렉토리 설정
const repoRoot = path.resolve(__dirname, '../..');
process.chdir(repoRoot);

/**
 * Git 명령어 실행
 */
function runGitCommand(command, description) {
  try {
    console.log(`\n📝 ${description}...`);
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'inherit',
      cwd: repoRoot
    });
    return output;
  } catch (error) {
    console.error(`❌ 오류 발생: ${description}`);
    console.error(error.message);
    throw error;
  }
}

/**
 * 변경된 파일 확인
 */
function getChangedFiles() {
  try {
    const output = execSync('git status --porcelain', { 
      encoding: 'utf-8',
      cwd: repoRoot
    });
    return output.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    return [];
  }
}

/**
 * 메인 함수
 */
function main() {
  console.log('🚀 블로그 포스트 자동 배포를 시작합니다...\n');

  // 1. 변경된 파일 확인
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('✅ 배포할 변경사항이 없습니다.');
    return;
  }

  console.log('📋 변경된 파일:');
  changedFiles.forEach(file => {
    console.log(`   - ${file.trim().substring(3)}`); // '?? ' 또는 ' M ' 제거
  });

  // 2. 모든 변경사항 스테이징
  try {
    runGitCommand('git add -A', '변경사항 스테이징');

    // 3. 커밋 메시지 생성
    const markdownFiles = changedFiles
      .filter(file => file.includes('.md'))
      .map(file => {
        const filename = file.trim().substring(3);
        return path.basename(filename, '.md');
      });

    let commitMessage = '[블로그] ';
    if (markdownFiles.length > 0) {
      commitMessage += markdownFiles.join(', ') + ' 글 추가/수정';
    } else {
      commitMessage += '블로그 업데이트';
    }

    // 4. 커밋
    runGitCommand(`git commit -m "${commitMessage}"`, '커밋 생성');

    // 5. 푸시
    runGitCommand('git push origin main', 'GitHub에 푸시');

    console.log('\n✅ 블로그 포스트가 성공적으로 배포되었습니다!');
    console.log('📦 GitHub Actions가 자동으로 배포를 진행합니다.');
    console.log('🌐 몇 분 후 https://jaykimdevop.github.io 에서 확인하세요.\n');

  } catch (error) {
    console.error('\n❌ 배포 중 오류가 발생했습니다.');
    console.error('수동으로 다음 명령어를 실행해주세요:');
    console.error('  git add .');
    console.error('  git commit -m "[블로그] 글 추가"');
    console.error('  git push origin main');
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { main };
