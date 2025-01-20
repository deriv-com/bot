import React from 'react';
import { useFormik } from 'formik';
import { getAppId, getDefaultAppIdAndUrl, getSocketURL } from '@/components/shared';
import { Button, Input, Text } from '@deriv-com/ui';
import { LocalStorageConstants } from '@deriv-com/utils';
import './endpoint.scss';
const Endpoint = () => {
    const formik = useFormik({
        initialValues: {
            appId: localStorage.getItem(LocalStorageConstants.configAppId) ?? getAppId(),
            serverUrl: localStorage.getItem(LocalStorageConstants.configServerURL) ?? getSocketURL(),
        },
        onSubmit: values => {
            localStorage.setItem(LocalStorageConstants.configServerURL, values.serverUrl);
            localStorage.setItem(LocalStorageConstants.configAppId, values.appId.toString());
            formik.resetForm({ values });
        },
        validate: values => {
            const errors: { [key: string]: string } = {};
            if (!values.serverUrl) {
                errors.serverUrl = 'This field is required';
            }
            if (!values.appId) {
                errors.appId = 'This field is required';
            } else if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(values.appId.toString())) {
                errors.appId = 'Please enter a valid app ID';
            }
            return errors;
        },
    });

    return (
        <div className='endpoint'>
            <Text weight='bold' className='endpoint__title'>
                Change API endpoint
            </Text>
            <form onSubmit={formik.handleSubmit} className='endpoint__form'>
                <Input
                    data-testid='dt_endpoint_server_url_input'
                    label='Server'
                    name='serverUrl'
                    message={formik.errors.serverUrl as string}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.serverUrl}
                />
                <Input
                    data-testid='dt_endpoint_app_id_input'
                    label='OAuth App ID'
                    name='appId'
                    message={formik.errors.appId as string}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.appId}
                />
                <div>
                    <Button className='endpoint__button' disabled={!formik.dirty || !formik.isValid} type='submit'>
                        Submit
                    </Button>
                    <Button
                        className='endpoint__button'
                        color='black'
                        onClick={() => {
                            const { server_url, app_id } = getDefaultAppIdAndUrl();
                            localStorage.setItem(LocalStorageConstants.configServerURL, server_url);
                            localStorage.setItem(LocalStorageConstants.configAppId, app_id.toString());

                            formik.resetForm({
                                values: {
                                    appId: app_id,
                                    serverUrl: server_url,
                                },
                            });
                            window.location.reload();
                        }}
                        variant='outlined'
                        type='button'
                    >
                        Reset to original settings
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Endpoint;
