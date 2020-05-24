import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import BloodPressureContext from '../contexts/BloodPressureContext';
import BP_MonitorInteractionModalContainer from '../components/BP_MonitorInteractionModalContainer';
import BP_BLE_Provider from '../contexts/BP_BLE_Provider';
import RegistrationMode from '../components/RegistrationMode';
import TransferMode from '../components/TransferMode';
export default function Sync() {
  const [state] = React.useContext(BloodPressureContext);
  const [
    isBpInteractionWindowOpen,
    setBPInteractionWindowOpen,
  ] = React.useState(false);
  const [transferMode, setTransferMode] = React.useState(false);

  const closeBpInteractionWindow = () => {
    setBPInteractionWindowOpen(false);
  };

  const openBpInteractionWindow = () => {
    if (!state.isPaired) {
      setTransferMode(false);
    } else setTransferMode(true);
    setBPInteractionWindowOpen(true);
  };

  return (
    <BP_BLE_Provider>
      <View style={styles.container}>
        <BP_MonitorInteractionModalContainer
          visible={isBpInteractionWindowOpen}
          onRequestClose={closeBpInteractionWindow}>
          {transferMode ? (
            <TransferMode onClose={closeBpInteractionWindow} />
          ) : (
            <RegistrationMode onClose={closeBpInteractionWindow} />
          )}
        </BP_MonitorInteractionModalContainer>
        {state.isPaired ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonTransfer]}
            onPress={openBpInteractionWindow}>
            <Text style={styles.buttonText}>
              Transfer new Blood Pressure Readings
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonRegister]}
            onPress={openBpInteractionWindow}>
            <Text style={styles.buttonText}>
              Register your new Omron Monitor now
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </BP_BLE_Provider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},

  button: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#CECECE',
    marginBottom: 12,
    marginHorizontal: 12,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  buttonTransfer: {
    backgroundColor: '#00A4CCFF',
  },
  buttonRegister: {
    backgroundColor: '#F95700FF',
  },
});
