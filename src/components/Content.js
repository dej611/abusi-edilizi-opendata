import React from 'react';
import {string, arrayOf, node, oneOfType} from 'prop-types';

export default function Content({children}) {
    return <p className="content is-medium">{children}</p>;
}

Content.propTypes = {
    children: oneOfType([string, node, arrayOf(oneOfType([string, node]))])
        .isRequired,
};
