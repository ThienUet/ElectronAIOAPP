// STOP DRAG IMAGEs
document.addEventListener('dragstart', (event) => {
  const tagName = event.target.tagName.toLowerCase();
  // Kiểm tra xem phần tử đang được kéo có phải là ảnh không
  if (tagName === 'img') {
    // Ngăn chặn hành vi mặc định của sự kiện dragstart
    event.preventDefault();
  }
});

// HANDLE CLOSE BTN
const closeBtn = document.getElementById('close-app');
closeBtn.addEventListener('click', () => {
  window.actions.closeApp();
});