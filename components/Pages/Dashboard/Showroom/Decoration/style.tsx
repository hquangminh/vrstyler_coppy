import styled from 'styled-components';

export const Wrapper = styled.div`
  .btn__preview {
    background-color: var(--color-primary-300);
    border: none;

    &:hover {
      background-color: var(--color-primary-500);
    }
  }
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: solid 1px var(--color-gray-4);
  & > div {
    flex: 0 0 33.33%;
  }
  .Showroom__Decoration__Btn_Back .ant-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0;
    color: var(--color-gray-7);
    background-color: transparent;
    transition: opacity 0.3s ease;

    &:hover {
      color: var(--color-primary-700);
      background-color: transparent;
    }
    a {
      color: inherit;
    }
  }
  .Showroom__Decoration__Theme_Name {
    font-size: 24px;
    color: var(--color-gray-11);
    text-align: center;
  }
`;
export const Save = styled.div`
  text-align: right;
  .ant-btn {
    width: 164px;
    height: 40px;
    font-weight: 500;
  }
`;
export const DecorationEditor = styled.div`
  display: flex;
  gap: 60px;

  padding: 24px 0;
`;
export const DecorationCreator = styled.div`
  flex: auto;
  padding: 0 10px;
  .decoration-creator-container {
    margin: 0 auto;
    max-width: 640px;
    & > div:not(:first-child),
    & > div > div:not(:first-child) {
      margin-top: 24px;
    }
  }
  .decoration-section {
    &:hover {
      box-shadow: 0 0 0 2px var(--color-gray-5);
    }
    &.active {
      box-shadow: 0 0 0 2px var(--color-primary-500);
    }
    &.active,
    &:hover {
      .decoration-section-actions {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .sortableHelper {
    .decoration-section {
      box-shadow: 0 0 0 2px var(--color-primary-500);
    }
    .decoration-section-actions {
      opacity: 1;
      visibility: visible;
    }
  }
`;
export const DecorationEditorPanel = styled.div`
  &:not(:empty) {
    width: 420px;
  }
`;
