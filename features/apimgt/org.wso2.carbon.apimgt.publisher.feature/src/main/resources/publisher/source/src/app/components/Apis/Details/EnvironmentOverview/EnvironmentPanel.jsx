/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import ApiThumb from 'AppComponents/Apis/Listing/components/ApiThumb';
import API from 'AppData/api';
import { Progress } from 'AppComponents/Shared';
import AuthManager from 'AppData/AuthManager';
import Utils from 'AppData/Utils';

import EnvironmentPanelMessage from './EnvironmentPanelMessage';

const styles = theme => ({
    header: {
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    lifeCycleMenu: {
        marginTop: '1.5em',
        marginBottom: '2em',
    },
});

class EnvironmentPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthorize: true,
        };
    }

    componentDidMount() {
        const { rootAPI, environment } = this.props;

        if (!AuthManager.getUser(environment.label)) {
            this.setState({ isAuthorize: false });
            return;
        }

        const promisedAPIs = API.all({ query: `name:${rootAPI.name}` });
        promisedAPIs
            .then((response) => {
                // Filter more since getAll({query: name:apiName}) is not filtering with exact name
                const allApis = response.obj.list.filter(api => api.name === rootAPI.name);
                this.setState({
                    apis: allApis,
                });
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') console.log(error);
                const { status } = error;
                if (status === 401) {
                    this.setState({ isAuthorize: false });
                }
            });
    }

    render() {
        const { environment, rootAPI, classes } = this.props;
        const { apis, isAuthorize } = this.state;
        const isFeatureEnabled = Utils.isMultiEnvironmentOverviewEnabled(environment.label);

        return (
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='title' gutterBottom>
                        {`${environment.label} Environment`}
                    </Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails className={classes.header}>
                    <Grid container>
                        <Grid item xs={12}>
                            {!isFeatureEnabled && (
                                <EnvironmentPanelMessage
                                    message='Multi-Environment Overview Feature is not enabled in this environment.'
                                />
                            )}
                            {!isAuthorize && (
                                <EnvironmentPanelMessage message='You are not login to this environment.' />
                            )}
                            {!apis && <Progress />}
                            {apis && apis.length === 0 ? (
                                <EnvironmentPanelMessage message='No APIs Found...' />
                            ) : (
                                <Grid container>
                                    {this.state.apis.map((api) => {
                                        return (
                                            <ApiThumb
                                                key={api.id}
                                                listType={this.state.listType}
                                                api={api}
                                                environmentName={environment.label}
                                                rootAPI={rootAPI}
                                                environmentOverview
                                            />
                                        );
                                    })}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

EnvironmentPanel.defaultProps = {};

EnvironmentPanel.propTypes = {
    environment: PropTypes.shape({
        label: PropTypes.string,
    }).isRequired,
    rootAPI: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
    classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(EnvironmentPanel);
