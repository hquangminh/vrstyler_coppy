import styled from 'styled-components';

import BlogCard from 'components/Fragments/BlogCard';

import { BlogModel } from 'models/blog.models';

import { maxMedia } from 'styles/__media';

type Props = {
  blogList?: BlogModel[];
  highlight?: string;
};

const HelpCenterList = (props: Props) => {
  return (
    <Wrapper>
      {props.blogList?.map((article) => {
        return <BlogCard key={article.id} data={article} />;
      })}
    </Wrapper>
  );
};
export default HelpCenterList;

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  ${maxMedia.medium} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  ${maxMedia.small} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${maxMedia.xsmall} {
    grid-template-columns: 100%;
  }
`;
