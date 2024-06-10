import React from 'react';

import { getStaticUrl, setUrlLanguage } from '@/components/shared/utils/url';
import { getLanguage } from '@/utils/tmp/dummy';

type TStaticUrl = React.HTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    is_document?: boolean;
    is_eu_url?: boolean;
};

const StaticUrl = ({ href, is_document, is_eu_url = false, children = null, ...props }: TStaticUrl) => {
    const getHref = () => {
        setUrlLanguage(getLanguage());
        return getStaticUrl(href, is_document, is_eu_url);
    };

    return (
        <a href={getHref()} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
