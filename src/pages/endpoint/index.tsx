import { useFormik } from 'formik';
import { Button, Input, Text } from '@deriv-com/ui';
import { LocalStorageConstants } from '@deriv-com/utils';
import './endpoint.scss';

const Endpoint = () => {
    const formik = useFormik({
        initialValues: {
            appId: window.localStorage.getItem(LocalStorageConstants.configAppId) || '',
            serverUrl: window.localStorage.getItem(LocalStorageConstants.configServerURL) || '',
        },
        onSubmit: values => {
            window.localStorage.setItem(LocalStorageConstants.configServerURL, values.serverUrl);
            window.localStorage.setItem(LocalStorageConstants.configAppId, values.appId);
            formik.resetForm({ values });
            window.location.reload();
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
                    message={formik.errors.serverUrl}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.serverUrl}
                />
                <Input
                    data-testid='dt_endpoint_app_id_input'
                    label='OAuth App ID'
                    name='appId'
                    message={formik.errors.appId}
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
                            window.localStorage.setItem(LocalStorageConstants.configServerURL, '');
                            window.localStorage.setItem(LocalStorageConstants.configAppId, '');
                            formik.resetForm();
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
