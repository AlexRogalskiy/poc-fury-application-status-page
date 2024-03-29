#!/usr/bin/env bash
# Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

set -e

kind create cluster --config=./development/kind-config.yml --kubeconfig=./.kubeconfig

kind load docker-image registry.sighup.io/poc/fury-application-status:latest

source ./development/.env-cluster

make seed

git clone https://github.com/ztombol/bats-support ./scripts/e2e/libs/bats-support

git clone https://github.com/ztombol/bats-assert ./scripts/e2e/libs/bats-assert

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

bats -t ./scripts/e2e/tests.sh

echo "Scenario 1"

make port-forward &

yarn --cwd ./e2e-test install && yarn --cwd ./e2e-test test --headless --spec cypress/integration/fury-application-status-scenario-1_spec.js

echo "Scenario 2"

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario2

pgrep kubectl | xargs kill -9

echo "Waiting for pods to be all ready"

kubectl wait --for=delete --timeout=60s -n fury-application-status pod --all

sleep 5

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

echo "Forwarding ports to pod"

make port-forward &

yarn --cwd ./e2e-test test --headless --spec cypress/integration/fury-application-status-scenario-2_spec.js

echo "Scenario 3"

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario3

pgrep kubectl | xargs kill -9

echo "Waiting for pods to be all ready"

kubectl wait --for=delete --timeout=60s -n fury-application-status pod --all

sleep 5

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

echo "Forwarding ports to pod"

make port-forward &

yarn --cwd ./e2e-test test --headless --spec cypress/integration/fury-application-status-scenario-3_spec.js
