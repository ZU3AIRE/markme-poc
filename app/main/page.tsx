"use client"
import { useState } from 'react';
import VideoStream from '../../components/VideoStream';
import AttendanceList from '../../components/AttendanceList';
import styles from "../../styles/Home.module.css"

export default function Home() {
  const [attendance, setAttendance] = useState<Array<{
    faceId: string;
    timestamp: Date;
    type: 'check-in' | 'check-out';
  }>>([]);

  const handleFaceEvent = (faceId: string, type: 'check-in' | 'check-out') => {
    setAttendance(prev => [...prev, {
      faceId,
      timestamp: new Date(),
      type
    }]);
  };

  return (
    <div className={styles.container}>
      <h1>Face Detection Attendance System</h1>
      <div className={styles.main}>
        <VideoStream onFaceEvent={handleFaceEvent} />
        <AttendanceList records={attendance} />
      </div>
    </div>
  );
}
