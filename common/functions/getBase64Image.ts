export default function getBase64Image(url: string, callback: (value: string) => void) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      if (reader.result) callback(reader.result.toString());
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
