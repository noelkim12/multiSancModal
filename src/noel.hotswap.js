// 결과값을 표시한다
(() => {
  let currentMouseX = 0;
  let currentMouseY = 0;

  // 마우스 움직임 추적
  document.addEventListener('mousemove', (e) => {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
  });
  // 드래그 이벤트 감지 및 컨텍스트 메뉴 표시
  document.addEventListener('keydown', async (e) => {
      // Ctrl + Shift + Z 키 조합 확인
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
          const mouseX = currentMouseX;
          const mouseY = currentMouseY;

          showInputPopup(mouseX, mouseY);

          e.preventDefault();
      }
      // Ctrl + Shift + X 키 조합 확인
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
          const selection = window.getSelection();

          if (selection.toString().length > 0) {
              // 선택된 텍스트가 있을 경우
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();

              let data = await $N.fetchSimple("/bo/base/mgr/j_resList.do", {
                  sk: "EMP_NM",
                  sv: selection.toString()
              }, "POST")

              if (data.totalNum !== 0) {
                  // 컨텍스트 메뉴 생성
                  showContextMenu(rect.right, rect.top, data.dataList);
              }

              // 기본 키 동작 방지
              e.preventDefault();
          }
      }
  });

  // 컨텍스트 메뉴 생성 함수
  function showContextMenu(x, y, data) {
      const contextMenu = document.createElement('div');
      contextMenu.className = 'context-menu';
      contextMenu.style.position = 'fixed';
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;

      // data 배열의 각 요소에 대해 메뉴 아이템 생성
      const menuList = document.createElement('ul');

      data.forEach(mgrObj => {
          const menuItem = document.createElement('li');
          menuItem.className = 'menu-item';
          menuItem.textContent = `${mgrObj.empNm} (${mgrObj.dptNm})`;
          menuItem.dataset.key = mgrObj.empNo;


          menuItem.addEventListener('click', () => {
              // 메뉴 아이템 클릭 처리
              if (confirm(`${mgrObj.empNm}님으로 접속하시겠습니까?`)) {
                  window.open(CTX_PATH + "/sso/login_test.jsp?mgrId=" + mgrObj.empNo)
                  contextMenu.remove();
              }
          });

          menuList.appendChild(menuItem);
      });

      contextMenu.appendChild(menuList);
      document.body.appendChild(contextMenu);

      // 다른 영역 클릭시 메뉴 제거
      document.addEventListener('mousedown', (e) => {
          if (!contextMenu.contains(e.target)) {
              contextMenu.remove();
          }
      });
  }

  function showInputPopup(x, y) {
      const popup = document.createElement('div');
      popup.className = 'input-popup';
      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '직원 이름을 입력하세요...';

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'button-group';

      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'confirm-btn';
      confirmBtn.textContent = '확인';
      confirmBtn.onclick = async () => {
          // 여기에 확인 버튼 클릭 시 실행할 로직 추가
          let data = await $N.fetchSimple("/bo/base/mgr/j_resList.do", {
              sk: "EMP_NM",
              sv: input.value
          }, "POST")

          if (data.totalNum !== 0) {
              // 컨텍스트 메뉴 생성
              showContextMenu(x, y, data.dataList);
          }
          popup.remove();
      };

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'cancel-btn';
      cancelBtn.textContent = '취소';
      cancelBtn.onclick = () => popup.remove();

      buttonGroup.appendChild(confirmBtn);
      buttonGroup.appendChild(cancelBtn);

      popup.appendChild(input);
      popup.appendChild(buttonGroup);
      document.body.appendChild(popup);

      input.focus();

      // 팝업 외부 클릭 시 닫기
      document.addEventListener('mousedown', (e) => {
          if (!popup.contains(e.target)) {
              popup.remove();
          }
      });
  }

})();
