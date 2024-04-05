import * as NodePDF from '@react-pdf/renderer';

type Props = {
  listType: { title: string; info: string }[];
  imageBanner: string;
};

const PDFComponent = (props: Props) => {
  return (
    <NodePDF.Document>
      <NodePDF.Page style={styles.body} size='A4'>
        <NodePDF.View style={styles.header}>
          <NodePDF.View style={styles.headerContainer}>
            <NodePDF.Image
              src={'/static/images/license/logo.png'}
              style={styles.headerLogo}></NodePDF.Image>
            <NodePDF.Text style={styles.headerText}>License Certificate</NodePDF.Text>
          </NodePDF.View>

          <NodePDF.Image style={styles.headerImage} src='/static/images/license/header.png' />
        </NodePDF.View>

        <NodePDF.Image style={styles.mainBanner} src={props.imageBanner} />

        <NodePDF.View>
          {props.listType?.map((text, index) => (
            <NodePDF.View key={index} style={styles.mainListItem}>
              <NodePDF.Text style={styles.mainListItemTitle}>{text.title}</NodePDF.Text>

              {text.title === 'Item Url' ? (
                <NodePDF.Link src={text.info} style={styles.mainListItemInfoLink}>
                  <NodePDF.Text style={styles.textTruncate}>{text.info}</NodePDF.Text>
                </NodePDF.Link>
              ) : (
                <NodePDF.Text style={styles.mainListItemInfo}>{text.info}</NodePDF.Text>
              )}
            </NodePDF.View>
          ))}
        </NodePDF.View>

        <NodePDF.View style={styles.mainInformationWrapper}>
          <NodePDF.Text style={styles.mainInformationTitle}>
            For any queries related to this document or license please contact VRStyler Support
          </NodePDF.Text>

          <NodePDF.Link src='mailto:contact@vrstyler.com' style={styles.mainInformationLink}>
            <NodePDF.Text> contact@vrstyler.com</NodePDF.Text>
          </NodePDF.Link>
        </NodePDF.View>

        <NodePDF.View style={styles.footerWrapper}>
          <NodePDF.Text style={styles.footerTitle}>VRStyler</NodePDF.Text>
          <NodePDF.Text style={styles.footerSubtitle}>
            179 Tran Hung Dao street, Floor 1, Vietnam Innovation Hub Building, Danang city, Vietnam{' '}
          </NodePDF.Text>
        </NodePDF.View>
      </NodePDF.Page>
    </NodePDF.Document>
  );
};

NodePDF.Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-all-400-normal.woff',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-all-500-normal.woff',
      fontWeight: 500,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-all-700-normal.woff',
      fontWeight: 600,
    },
  ],
});

NodePDF.Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const styles = NodePDF.StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'Roboto',
    fontWeight: 400,
  },

  header: {
    position: 'relative',
    backgroundColor: '#499fb6',
  },
  headerLogo: {
    width: '118px',
    height: '19px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px 32px 60px 32px',
  },
  headerText: {
    color: '#fff',
    fontSize: '19px',
    fontWeight: 600,
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    bottom: '4px',
    left: 0,
  },

  mainListWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainListItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '6px',
    fontSize: '10px',
  },
  mainListItemTitle: {
    width: '127px',
    padding: '11px 0',
    paddingLeft: '9.5px',
    color: '#434343',
    backgroundColor: '#f0f0f0',
    fontWeight: 500,
  },
  mainListItemInfoLink: {
    color: '#1890ff',
    padding: '11px 9.5px',
    backgroundColor: '#d9d9d9',
    flex: 1,
    textDecoration: 'none',
    fontFamily: 'Roboto',
  },

  textTruncate: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
    fontFamily: 'Roboto',
  },

  mainListItemInfo: {
    color: '#1f1f1f',
    padding: '11px 0',
    paddingLeft: '9.5px',
    backgroundColor: '#d9d9d9',
    flex: 1,
  },

  mainBanner: {
    margin: '19px auto',
    width: '229px',
    height: '172px',
    objectFit: 'cover',
  },
  mainInformationWrapper: {
    marginTop: '8px',
    marginBottom: '34px',
    textAlign: 'center',
  },
  mainInformationTitle: {
    color: '#434343',
    fontSize: '10px',
    marginBottom: '6px',
  },
  mainInformationLink: {
    color: '#32788f',
    fontSize: '12px',
    textDecoration: 'none',
    fontWeight: 600,
  },

  footerWrapper: {
    padding: '19px 0',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  footerTitle: {
    marginBottom: '6px',
    fontSize: '15px',
    color: '#1f1f1f',
    fontWeight: 500,
  },
  footerSubtitle: {
    fontSize: '10px',
    color: '#434343',
  },

  pageNumber: {
    position: 'absolute',
    fontSize: '12px',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export default PDFComponent;
