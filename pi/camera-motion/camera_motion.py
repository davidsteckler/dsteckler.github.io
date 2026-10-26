from picamera2 import Picamera2
import cv2
camera = Picamera2()
background = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=25, detectShadows=False)
try:
    camera.configure(camera.create_video_configuration(main={"size": (640, 480), "format": "RGB888"}))
    camera.start()
    frames = 0
    while True:
        frame = camera.capture_array()
        mask = background.apply(frame)
        frames += 1
        changed = cv2.countNonZero(mask) / mask.size
        label = "WARMUP" if frames < 60 else ("MOTION" if changed > 0.03 else "Still")
        cv2.putText(frame, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Motion detector - q quits", frame)
        cv2.imshow("Changed pixels", mask)
        if cv2.waitKey(20) & 0xFF == ord("q"):
            break
finally:
    camera.close()
    cv2.destroyAllWindows()
