import styled from 'styled-components';
import Icon from 'components/Fragments/Icons';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  user-select: none;
  cursor: pointer;

  &:hover .square {
    border-color: rgba(var(--color-primary-rgb-700), 70%);
  }

  &.active {
    .square {
      background-color: var(--color-primary-700);

      .my-icon {
        display: block;
      }
    }
  }

  .square {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;

    border-radius: 1px;
    background-color: #edf6f8;
    border: 1px solid transparent;

    transition: all 150ms ease-in-out;

    .my-icon {
      display: none;
      width: 1.4rem;
      color: var(--color-white);
    }
  }

  .title {
    font-size: 14px;
    line-height: 1.14;
    color: var(--secondary);
  }
`;

type Props = {
  title: string;
  active?: boolean;
  className?: string;
  onChecked?: () => void;
};

const ExploreCheckboxCustom = (props: Props) => {
  const { active = false, className = '' } = props;
  return (
    <Wrapper className={className + (active ? ' active' : '')} onClick={props.onChecked}>
      <p className='square'>
        <Icon iconName='checked' />
      </p>
      <p className='title'>{props.title}</p>
    </Wrapper>
  );
};

export default ExploreCheckboxCustom;
