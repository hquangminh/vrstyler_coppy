const convertHTMLEntity = (text: string) => {
  if (typeof window !== 'undefined' && text) {
    text = text.replace(/<\/?[^>]+(>|$)/g, '');
    const span = document.createElement('span');
    return text.replace(/&[#A-Za-z0-9]+;/gi, (entity) => {
      span.innerHTML = entity;
      return span.innerText;
    });
  } else return '';
};

export default convertHTMLEntity;
