type Parameter = {
  id: string;
  behavior?: ScrollBehavior;
  deduct?: number;
};
export default function scrollToElementById({ id, behavior, deduct = 0 }: Parameter) {
  const elm = document.getElementById(id);
  if (elm) window.scrollTo({ top: elm.offsetTop - deduct, behavior });
}
