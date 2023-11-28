
const loadApp = async () => {
  const response = await window.actions.loadDataWithDir('');
    if (!Array.isArray(response)) {
      window.actions.displayError(response);
    } else {
      const listProgram = response;
      const getListId = document.getElementById('application-list');
      listProgram.map((item) => {
        const li = document.createElement('li');
        li.className = 'application-item';
        li.id = 'application-item';
  
  
        const div = document.createElement('div');
        div.className = 'application-image';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'picture';
  
        const span = document.createElement('span');
        span.className = 'application-name';
        span.textContent = item.name;
  
        const spanUrl = document.createElement('span');
        spanUrl.className = 'application-location';
        spanUrl.textContent = item.urlApp;
  
        div.appendChild(img);
        li.appendChild(div);
        li.appendChild(span);
        li.appendChild(spanUrl);
        getListId.appendChild(li);
      });
  
      // HOVER EACH ITEM WILL SHOW IT'S NAME
      const list = document.querySelectorAll('.application-item');
      const nameShow = document.getElementById('application-hovering');
      nameShow.innerText = 'Please, choose one of applications that listed in the window !'
      list.forEach(element => {
        element.addEventListener('mouseover', () => {
          const text = element.children[1].textContent;
          nameShow.innerText = "Pointer -> " + text;
        })
        element.addEventListener('mouseleave', () => {
          nameShow.innerText = 'Please, choose one of applications that listed in the window !';
        })
      });
  
      // ACTION CLICK ON ITEM
      const liAppClick = document.querySelectorAll('.application-item');
      liAppClick.forEach(async (item) => {
        item.addEventListener("click", async() => {
          const dataToExtractAndRun = {
            name: item.children[1].textContent,
            urlApp: item.children[2].textContent
          }
          window.actions.execute(dataToExtractAndRun);
        })
      })
    }
}

loadApp();

// SHOW SEARCH FILTER
const inputField = document.getElementById('input-search');
const inputShow = document.getElementById('input-search-show');
inputField.addEventListener('input', (event) => {
  if (event.target.value) {
    inputShow.style.display = 'inline-block';
    inputShow.innerText = event.target.value;
  } else {
    inputShow.style.display = 'none';
  }
})

// CLEAR SEARCH FILTER
inputShow.addEventListener('click', () => {
  inputShow.style.display = 'none';
  inputField.value = "";
})

