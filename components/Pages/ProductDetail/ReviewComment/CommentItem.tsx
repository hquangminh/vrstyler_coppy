import React, { createElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Tooltip } from 'antd';
import { Comment } from '@ant-design/compatible';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';

import { AppState } from 'store/type';

import { urlGoToProfile } from 'common/functions';
import { avtDefault } from 'common/constant';
import commentServices from 'services/comment-services';

import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';
import HtmlComponent from 'components/Fragments/HtmlComponent';

import { CommentModel } from 'models/comment.model';

import styled from 'styled-components';

type Props = {
  data: CommentModel;
  handelReply: (nickname: string, userId: string, type: number) => void;
};

const CommentItem = (props: Props) => {
  const router = useRouter();
  const { langCode, langLabel } = useLanguage();

  const auth = useSelector((state: AppState) => state.auth);

  const [action, setAction] = useState<'like' | 'dislike' | undefined>(
    props.data.market_likes_comments ? props.data.market_likes_comments[0]?.type : undefined
  );
  const [likes, setLikes] = useState<number>(props.data.like_count);
  const [dislikes, setDislikes] = useState<number>(props.data.dislike_count);
  const [isActionRunning, setIsActionRunning] = useState<boolean>(false);

  const handelLike = async (type: 'like' | 'dislike' | 'cancel-like' | 'cancel-dislike') => {
    try {
      setIsActionRunning(true);
      const { error } = await commentServices[
        type === 'like' || type === 'cancel-like' ? 'likeComment' : 'dislikeComment'
      ](props.data.id);

      if (!error) {
        if (type === 'cancel-like' || type === 'cancel-dislike') setAction(undefined);
        else setAction(type);

        if (type === 'like') {
          setLikes(likes + 1);
          if (action === 'dislike') setDislikes(dislikes - 1);
        } else if (type === 'dislike') {
          setDislikes(dislikes + 1);
          if (action === 'like') setLikes(likes - 1);
        } else if (type === 'cancel-like') setLikes(likes - 1);
        else if (type === 'cancel-dislike') setDislikes(dislikes - 1);
      }
      setIsActionRunning(false);
    } catch (error) {
      setIsActionRunning(false);
    }
  };

  const onScrollToWrite = () => {
    const commentLogin = document.getElementById('ProductComment__Login');
    const commentWrite = document.getElementById('ProductComment__Write');

    if (!auth?.token) window.scrollTo({ top: (commentLogin?.offsetTop ?? 70) - 70 });
    else window.scrollTo({ top: (commentWrite?.offsetTop ?? 70) - 70 });
  };

  const actions = [
    <CommentAction
      key='like-commnet'
      disabled={isActionRunning}
      onClick={() => handelLike(action === 'like' ? 'cancel-like' : 'like')}>
      {createElement(action === 'like' ? LikeFilled : LikeOutlined)}
      <span className='comment-action'>{likes}</span>
    </CommentAction>,

    <CommentAction
      key='dislike-commnet'
      disabled={isActionRunning}
      onClick={() => handelLike(action === 'dislike' ? 'cancel-dislike' : 'dislike')}>
      {React.createElement(action === 'dislike' ? DislikeFilled : DislikeOutlined)}
      <span className='comment-action'>{dislikes}</span>
    </CommentAction>,

    <span
      key='comment-basic-reply-to'
      onClick={() => {
        props.handelReply(
          props.data.market_user.nickname,
          props.data.market_user.id,
          props.data.market_user.type
        );
        onScrollToWrite();
      }}>
      {langLabel.btn_reply_to}
    </span>,
  ];

  const url = urlGoToProfile(props.data.market_user.type, props.data.market_user.nickname);

  return (
    <Comment
      actions={actions}
      author={
        <CommentAuth onClick={() => url && router.push(url)}>
          {props.data.market_user.name}
          <span>(@{props.data.market_user.nickname})</span>
        </CommentAuth>
      }
      avatar={
        <MyImage
          width={32}
          height={32}
          src={props.data.market_user.image}
          img_error={avtDefault}
          alt={props.data.market_user.name}
          style={{ objectFit: 'cover' }}
          onClick={() => url && router.push(url)}
        />
      }
      content={
        <CommentContent>
          <HtmlComponent html={convertToHtml(props.data.content)} />
        </CommentContent>
      }
      datetime={
        <Tooltip title={<Moment date={props.data.createdAt} langCode={langCode} showTime />}>
          <CommentDate>
            <Moment date={props.data.createdAt} langCode={langCode} fromNow />
          </CommentDate>
        </Tooltip>
      }
    />
  );
};

export default CommentItem;

const CommentAuth = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--color-primary-700) !important;
  word-break: break-word;
  cursor: pointer;
  span {
    margin-left: 2px;
    font-size: 13px;
    font-weight: 400;
    color: var(--color-gray-7);
  }
`;
const CommentDate = styled.div`
  font-size: 12px;
  color: var(--color-gray-7);
  cursor: default;
`;
const CommentContent = styled.div`
  .mention {
    padding: 0 4px;
    border-radius: 2px;
    color: var(--color-primary-700);
    background-color: var(--color-primary-100);
    &:not([href]) {
      cursor: default;
    }
  }
`;
const CommentAction = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 12px;
  color: var(--color-gray-7);

  cursor: pointer;

  ${(props) => {
    if (props.disabled) return `user-select: none;`;
  }}

  .comment-action {
    line-height: 1;
  }
`;

function linkify(content: string) {
  const replacePattern1 =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  return content
    .replaceAll('<br/>', ' <br/>')
    .replaceAll(/\&nbsp;/g, ' ')
    .replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
}

const convertToHtml = (comment: string) => {
  let regex = /@\[.+?\]\(.+?\)/gm;
  let displayRegex = /@\[.+?\]/g;
  let idRegex = /\(.+?\)/g;
  let matches = comment.match(regex);
  let arr: any = [];
  matches &&
    matches.forEach((m: any) => {
      let id = m.match(idRegex)[0].replace('(', '').replace(')', '');
      let display = m.match(displayRegex)[0].replace('@[', '').replace(']', '');

      arr.push({ id: id, display: display });
    });
  let newComment = comment.split(regex);

  let replacedText = '';
  for (let i = 0; i < newComment.length; i++) {
    const c = newComment[i];
    if (i === newComment.length - 1) replacedText += c;
    else {
      let url = '';
      if (arr[i].id.startsWith('user:')) {
        url = urlGoToProfile(
          Number(arr[i].id.split('?')[1] ? arr[i].id.split('?')[1].slice(-1) : 1),
          arr[i].display
        );
      } else url = `mailto:${arr[i].display}`;

      if (url) replacedText += c + `<a class="mention" href="${url}">${arr[i].display}</a>`;
      else replacedText += c + `<span class="mention">${arr[i].display}</span>`;
    }
  }

  return linkify(replacedText);
};
