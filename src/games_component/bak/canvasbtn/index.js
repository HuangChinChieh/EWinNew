// 測試用

import { useEffect, useRef } from 'react';
import './index.scss';
const CanvasButton = () => {
    const canvasRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx) {
            const path = new Path2D();
            path.moveTo(0, 0);
            path.lineTo(0, 100);
            path.lineTo(150, 150);
            path.lineTo(300, 150);
            path.lineTo(300, 100);
            path.lineTo(200, 100);
            path.lineTo(100, 0);
            path.lineTo(0, 0);

            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fill(path);

            pathRef.current = path; // 保存路径的引用

            const handleClick = (event) => {

                const rect = canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;

                if (ctx.isPointInPath(pathRef.current, mouseX, mouseY)) {
                    console.log('path')
                }

            };

            canvas.addEventListener('click', handleClick);

            return () => {
                canvas.removeEventListener('click', handleClick);
            };

        }
    }, []);

    return (
        <div className='canvas-button-box'>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default CanvasButton;