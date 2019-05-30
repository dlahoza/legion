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
import * as React from 'react';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';

import * as style from '../../componentsStyle/dialogs';
import * as model from '../../models/cloud';
import * as base from './base';

export const REMOVE_DEPLOYMENT_LABEL = 'Remove';
export const REMOVE_TRAINING_LABEL = 'Remove';
export const SCALE_DEPLOYMENT_LABEL = 'Scale';
export const CREATE_DEPLOYMENT_LABEL = 'Deploy';

export function showCloudTrainInformationDialog(training: model.ICloudTrainingResponse) {
  return showDialog({
    title: `Cloud training information`,
    body: (
      <div>
        <h3 className={style.fieldLabelStyle}>Name</h3>
        <p className={style.fieldTextStyle}>{training.name}</p>
        <h3 className={style.fieldLabelStyle}>State</h3>
        <p className={style.fieldTextStyle}>{training.status.state}</p>
        {training.status.modelImage.length > 0 ? (<React.Fragment>
          <h3 className={style.fieldLabelStyle}>Image (toolchain)</h3>
          <p className={style.fieldTextStyle}>{training.status.modelImage} ({training.spec.toolchain})</p>
        </React.Fragment>) : (<React.Fragment>
          <h3 className={style.fieldLabelStyle}>Toolchain</h3>
          <p className={style.fieldTextStyle}>{training.spec.toolchain}</p>
        </React.Fragment>)}
        <h3 className={style.fieldLabelStyle}>Model (id / version)</h3>
        {training.status.id.length > 0 ? (
          <p className={style.fieldTextStyle}>{training.status.id} / {training.status.version}</p>
        ) : (
          <p className={style.fieldTextStyle}>unknown</p>
        )}

        <h3 className={style.fieldLabelStyle}>VCS</h3>
        <p className={style.fieldTextStyle}>{training.spec.vcsName}:{training.spec.reference}</p>
        <h3 className={style.fieldLabelStyle}>File (working directory)</h3>
        <p className={style.fieldTextStyle}>{training.spec.entrypoint} {training.spec.workDir.length > 0 ? `(${training.spec.workDir})` : ''}</p>
      </div>
    ),
    buttons: [
      Dialog.createButton({ label: CREATE_DEPLOYMENT_LABEL }),
      Dialog.warnButton({ label: REMOVE_TRAINING_LABEL }),
      Dialog.cancelButton({ label: 'Close window' })
    ]
  })
}

export function showCloudDeploymentInformationDialog(deploymentInformation: model.ICloudDeploymentResponse) {
  return showDialog({
    title: `Cloud deployment information`,
    body: (
      <div>
        <h3 className={style.fieldLabelStyle}>Deployment name</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.name}</p>
        <h3 className={style.fieldLabelStyle}>Mode</h3>
        <p className={style.fieldTextStyle}>CLUSTER</p>
        <h3 className={style.fieldLabelStyle}>Image</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.spec.image}</p>
        <h3 className={style.fieldLabelStyle}>Replicas (actual / desired)</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.status.availableReplicas} / {deploymentInformation.spec.replicas}</p>
        <h3 className={style.fieldLabelStyle}>Probes (initial / readiness)</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.spec.livenessProbeInitialDelay} sec. / {deploymentInformation.spec.readinessProbeInitialDelay} sec.</p>
      </div>
    ),
    buttons: [
      Dialog.createButton({ label: REMOVE_DEPLOYMENT_LABEL, displayType: 'warn' }),
      Dialog.createButton({ label: SCALE_DEPLOYMENT_LABEL }),
      Dialog.okButton({ label: 'Close window' })
    ]
  })
}

export interface ICreateNewDeploymentDialogValues {
  name: string;
  replicas: number;
}

class CreateNewDeploymentDetailsDialog extends Widget {
  constructor(deploymentImage: string) {
    super({ node: Private.buildCreateNewDeploymentDetailsDialog(deploymentImage) });
  }

  getValue(): ICreateNewDeploymentDialogValues {
    let inputs = this.node.getElementsByTagName('input');
    const nameInput = inputs[0] as HTMLInputElement;
    const replicasInput = inputs[1] as HTMLInputElement;

    return {
      name: nameInput.value,
      replicas: parseInt(replicasInput.value)
    };
  }
}

export function showCreateNewDeploymentDetails(deploymentImage: string) {
  return showDialog({
    title: 'Creation of new deployment',
    body: new CreateNewDeploymentDetailsDialog(deploymentImage),
    buttons: [
      Dialog.cancelButton(),
      Dialog.okButton({ label: 'Deploy' })
    ]
  })
}

export interface IIssueModelAccessTokenDialogValues {
  modelId: string;
  modelVersion: string;
}

class IssueModelAccessTokenDialog extends Widget {
  constructor() {
    super({ node: Private.buildIssueModelAccessTokenDialog() });
  }

  getValue(): IIssueModelAccessTokenDialogValues {
    let inputs = this.node.getElementsByTagName('input');
    const modelIDInput = inputs[0] as HTMLInputElement;
    const modelVersionInput = inputs[1] as HTMLInputElement;

    return {
      modelId: modelIDInput.value,
      modelVersion: modelVersionInput.value
    };
  }
}

export function showIssueModelAccessToken() {
  return showDialog({
    title: 'Creation of cloud access token',
    body: new IssueModelAccessTokenDialog(),
    buttons: [
      Dialog.cancelButton(),
      Dialog.okButton({ label: 'Get token' })
    ]
  })
}

export interface ICreateNewTrainingDialogValues {
  name?: string;
  toolchain?: string;
  entrypoint?: string;
  image?: string;
  vcsName?: string;
  workDir?: string;
  reference?: string;

  isFinished: boolean;
}

class CreateNewTrainingDialog extends Widget {
  constructor(availableVCSs: Array<model.IVCSResponse>, defaultValues: ICreateNewTrainingDialogValues) {
    super({ node: Private.buildCreateNewTrainingDialog(availableVCSs, defaultValues) });
  }

  getValue(): ICreateNewTrainingDialogValues {
    let inputs = this.node.getElementsByTagName('input');
    let selects = this.node.getElementsByTagName('select');

    const nameInput = inputs[0] as HTMLInputElement;
    const entrypointInput = inputs[1] as HTMLInputElement;
    const imageInput = inputs[2] as HTMLInputElement;
    const workDirInput = inputs[3] as HTMLInputElement;
    const referenceInput = inputs[4] as HTMLInputElement;

    const toolchainSelect = selects[0] as HTMLSelectElement;
    const vcsSelect = selects[1] as HTMLSelectElement;

    let data = {
      name: nameInput.value,
      toolchain: toolchainSelect.selectedIndex >= 0 ? toolchainSelect.options[toolchainSelect.selectedIndex].value : '',
      entrypoint: entrypointInput.value,
      image: imageInput.value,
      vcsName: vcsSelect.selectedIndex >= 0 ? vcsSelect.options[vcsSelect.selectedIndex].value : '',
      workDir: workDirInput.value,
      reference: referenceInput.value,
      isFinished: null
    };

    data.isFinished = data.name.length > 0 && data.toolchain.length > 0 && data.entrypoint.length > 0 && data.vcsName.length > 0;

    return data;
  }
}

export function showCreateNewTrainingDialog(availableVCSs: Array<model.IVCSResponse>, defaultValues?: ICreateNewTrainingDialogValues) {
  return showDialog({
    title: 'Creation of cloud training',
    body: new CreateNewTrainingDialog(availableVCSs, defaultValues !== undefined ? defaultValues : {isFinished: false}),
    buttons: [
      Dialog.cancelButton(),
      Dialog.okButton({ label: 'Train on a cloud' })
    ]
  })
}

namespace Private {
  export function buildCreateNewDeploymentDetailsDialog(deploymentImage: string) {
    let body = base.createDialogBody();
    body.appendChild(base.createDescriptionLine(`You are going to deploy image ${deploymentImage} on a cluster.`))
    body.appendChild(base.createDialogInputLabel('Deployment name'))
    body.appendChild(base.createDialogInput(undefined, 'name of deployment'))
    body.appendChild(base.createDialogInputLabel('Count of replicas'))
    body.appendChild(base.createDialogInput('1'))
    return body;
  }

  export function buildIssueModelAccessTokenDialog() {
    let body = base.createDialogBody();
    body.appendChild(base.createDialogInputLabel('Model ID'))
    body.appendChild(base.createDialogInput())
    body.appendChild(base.createDialogInputLabel('Model version'))
    body.appendChild(base.createDialogInput())
    return body;
  }

  export function buildCreateNewTrainingDialog(availableVCSs: Array<model.IVCSResponse>, defaultValues: ICreateNewTrainingDialogValues){
    let body = base.createDialogBody();
    body.appendChild(base.createDescriptionLine('You\'re going to create new training on a cloud'));
    body.appendChild(base.createDialogInputLabel('Name of training'));
    body.appendChild(base.createDialogInput(defaultValues.name));
    body.appendChild(base.createDialogInputLabel('Toolchain'));
    body.appendChild(base.createSelect([
      {
        text: 'Python (for *.py files)',
        value: 'python',
      },
      {
        text: 'Jupyter (for *.ipynb files)',
        value: 'jupyter',
      }
    ], defaultValues.toolchain));
    body.appendChild(base.createDialogInputLabel('Entry point (main train file)'));
    body.appendChild(base.createDialogInput(defaultValues.entrypoint));
    body.appendChild(base.createDialogInputLabel('Custom train image (toolchain\'s by default)'));
    body.appendChild(base.createDialogInput(defaultValues.image));
    body.appendChild(base.createDialogInputLabel('VCS (Sources Codes Repository)'));
    body.appendChild(base.createSelect(availableVCSs.map(vcs => {
      return {
        text: `${vcs.name} (${vcs.spec.uri}, ref: ${vcs.spec.defaultReference})`,
        value: vcs.name
      }
    }), defaultValues.vcsName));
    body.appendChild(base.createDialogInputLabel('Custom working directory'));
    body.appendChild(base.createDialogInput(defaultValues.workDir));
    body.appendChild(base.createDialogInputLabel('Source code version (override)'));
    body.appendChild(base.createDialogInput(defaultValues.reference));
    return body;
  }
}