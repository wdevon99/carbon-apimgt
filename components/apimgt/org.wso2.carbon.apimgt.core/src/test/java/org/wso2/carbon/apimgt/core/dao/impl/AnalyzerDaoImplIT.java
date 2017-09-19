/*
* Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package org.wso2.carbon.apimgt.core.dao.impl;

import org.testng.Assert;
import org.testng.annotations.Test;
import org.wso2.carbon.apimgt.core.TestUtil;
import org.wso2.carbon.apimgt.core.dao.AnalyticsDAO;
import org.wso2.carbon.apimgt.core.models.analytics.APICount;
import org.wso2.carbon.apimgt.core.models.analytics.ApplicationCount;

import java.time.Instant;
import java.util.List;

/**
 * AnalyzerDaoImpl Test cases.
 */
public class AnalyzerDaoImplIT extends DAOIntegrationTestBase {

    @Test
    public void testGetApplicationCount() throws Exception {
        Instant fromTimeStamp = Instant.ofEpochMilli(System.currentTimeMillis());
        TestUtil.addCustomApplication("app1", "john");
        Instant toTimeStamp = Instant.ofEpochMilli(System.currentTimeMillis());
        AnalyticsDAO analyticsDAO = DAOFactory.getAnalyticsDAO();
        List<ApplicationCount> applicationCountList = analyticsDAO
                .getApplicationCount(fromTimeStamp, toTimeStamp, null);
        Assert.assertEquals(applicationCountList.size(), 1);
    }

    @Test
    public void testGetAPICount() throws Exception {
        Instant fromTimeStamp = Instant.ofEpochMilli(System.currentTimeMillis());
        TestUtil.addTestAPI();
        Instant toTimeStamp = Instant.ofEpochMilli(System.currentTimeMillis());
        AnalyticsDAO analyticsDAO = DAOFactory.getAnalyticsDAO();
        List<APICount> applicationCountList = analyticsDAO
                .getAPICount(fromTimeStamp, toTimeStamp, null);
        Assert.assertEquals(applicationCountList.size(), 1);
    }

}