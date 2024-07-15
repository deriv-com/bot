module.exports = {
    renderToString: jest.fn(() => '<div>mocked HTML</div>'),
    renderToStaticMarkup: jest.fn(() => '<Xml xmlns=`http://www.w3.org/1999/xhtml` id=`toolbox`>mocked XML</Xml>'),
};
