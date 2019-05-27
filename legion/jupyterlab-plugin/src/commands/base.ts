/**
 *   Copyright 2019 EPAM Systems
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import { JupyterLab } from '@jupyterlab/application';
import { ServiceManager } from '@jupyterlab/services';
import { ISplashScreen } from "@jupyterlab/apputils";

import { IApiState } from '../models';
import { ILegionApi } from '../api';


/**
 * CommandIDs contains IDs of all Legion commands.
 * This commands can be used outside of Legion system.
 */
export namespace CommandIDs {
    // UI
    export const openCloudModelPlugin = 'legion:ui-cloud-mode';
    export const openLocalModelPlugin = 'legion:ui-local-mode';
    export const mainRepository = 'legion:main-repository';

    // Authorize
    export const unAuthorizeOnCluster = 'legion:cloud-reset-auth';
    export const authorizeOnCluster = 'legion:cloud-start-auth';
    export const openLocalMetrics = 'legion:open-local-metrics';

    // Local
    export const newLocalBuild = 'legion:local-build-new';
    export const newLocalDeployment = 'legion:local-deployment-new';
    export const removeLocalDeployment = 'legion:local-deployment-remove';

    // Settings
    export const refreshLocal = 'legion:refresh-local-mode';
    export const refreshLocalBuildStatus = 'legion:refresh-local-mode-build-status';
    export const refreshCloud = 'legion:refresh-cloud-mode';

    export const palleteCommands = [
        openCloudModelPlugin,
        openLocalModelPlugin,
        mainRepository,
        refreshLocal,
        refreshLocalBuildStatus,
        refreshCloud,
        unAuthorizeOnCluster,
        openLocalMetrics
    ];
}

export interface IAddCommandsOptions {
    app: JupyterLab;
    services: ServiceManager;
    api: ILegionApi;
    apiState: IApiState;
    splash: ISplashScreen;
}