import React, {useEffect} from 'react';

import Loading from './Loading';
import MonitorNotFoundError from './MonitorNotFoundError';
import Success from './Success';
import useConnection from '../hooks/useConnection';
import useBattery from '../hooks/useBattery';
import useTime from '../hooks/useTime';
import useGetBloodPressure from '../hooks/useGetBloodPressure';
import BloodPressureContext from '../contexts/BloodPressureContext';
import {
  NEW_BLOOD_PRESSURE_SYNC,
  NEW_BLOOD_PRESSURE_READING,
  SYNC_COMPLETE,
} from '../reducers/bloodPressureReducer';

export default function Transferring({onCancel, onSuccess}) {
  const [{device}, dispatch] = React.useContext(BloodPressureContext);
  const {connect, error, loading, data: connectionResult} = useConnection();

  const {data: batteryLevel, getBattery} = useBattery();
  const {data: time, getTime} = useTime();
  const {data: blood, getBloodPressure} = useGetBloodPressure(
    bloodPressureReceiveHandler,
  );
  const [startedBloodPressure, setStartedBloodPressure] = React.useState(false);
  useEffect(() => {
    connect(device.id);
    dispatch({
      type: NEW_BLOOD_PRESSURE_SYNC,
      payload: {timeSyncStarted: new Date()},
    });
  }, []);

  useEffect(() => {
    if (connectionResult && connectionResult.success && !startedBloodPressure) {
      setStartedBloodPressure(true);
      getBattery(device.id);
      getBloodPressure(device.id);
      getTime(device.id);
    }
  }, [connectionResult]);

  function bloodPressureReceiveHandler(error, bloodPressureValue) {
    console.log('bloodPressureReceiveHandler', bloodPressureValue);
    if (!error) {
      if (bloodPressureValue) {
        dispatch({
          type: NEW_BLOOD_PRESSURE_READING,
          payload: bloodPressureValue,
        });
      }
    } else {
      dispatch({
        type: SYNC_COMPLETE,
      });
    }
  }
  if (error) {
    return <MonitorNotFoundError onClose={onCancel} />;
  }

  if (blood) {
    console.log(JSON.stringify(blood));

    return (
      <Success
        onClose={onSuccess}
        message="You have transferred any new readings successfully!"
      />
    );
  }

  return <Loading loading={true} operation="Transferring readings" />;
}
