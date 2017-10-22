import updateQueryStringParameter from './updateQueryStringParameter';

export function openBox(targetContent) {
  const newURL = updateQueryStringParameter(document.URL, 'darklight', targetContent);
  window.history.pushState(targetContent, null, newURL);
  this.box.classList.add('is-active');
  this.box.querySelector(`[data-darklight-content=${targetContent}]`).classList.add('is-active');
}

export function closeBox(popHistory = true) {
  if (this.box.classList.contains('is-active')) {
    this.box.classList.remove('is-active');
    this.box.querySelectorAll('.darklight-content').forEach(content => content.classList.remove('is-active'));
    if (popHistory === true) {
      window.history.go(-1);
    }
  }
}
