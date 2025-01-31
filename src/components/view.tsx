// src/components/DownloadButton.tsx
import React from 'react';
import { Panel, useReactFlow } from '@xyflow/react';

interface DownloadButtonProps {
	reactFlowWrapper: React.RefObject<HTMLDivElement>;
}

const imageWidth = 1024;
const imageHeight = 768;

const DownloadButton: React.FC<DownloadButtonProps> = ({
	reactFlowWrapper,
}) => {
	const { getNodes } = useReactFlow();

	const onClick = () => {
		if (!reactFlowWrapper.current) {
			console.error('ReactFlow wrapper is not available.');
			return;
		}

		// React Flow 컨테이너 내 SVG 요소 찾기
		const svg = reactFlowWrapper.current.querySelector('svg');

		if (!svg) {
			console.error(
				'SVG 요소를 ReactFlow wrapper 내에서 찾을 수 없습니다.'
			);
			return;
		}

		// SVG 직렬화
		const serializer = new XMLSerializer();
		let svgString = serializer.serializeToString(svg);

		// XML 네임스페이스 추가 (필요시)
		if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
			svgString = svgString.replace(
				'<svg',
				'<svg xmlns="http://www.w3.org/2000/svg"'
			);
		}

		// 이미지 크기 설정 (선택 사항)
		svgString = svgString
			.replace(/width="[^"]*"/, `width="${imageWidth}"`)
			.replace(/height="[^"]*"/, `height="${imageHeight}"`);

		const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
			svgString
		)}`;

		// 이미지 객체 생성
		const img = new Image();

		// 크로스 오리진 설정 (필요시)
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			// Canvas 생성
			const canvas = document.createElement('canvas');
			canvas.width = imageWidth;
			canvas.height = imageHeight;
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				console.error('Canvas 컨텍스트를 얻을 수 없습니다.');
				return;
			}

			// 배경색 설정 (선택 사항)
			ctx.fillStyle = '#1a365d';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 이미지 그리기
			ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

			// PNG 데이터 URL 생성
			const pngDataUrl = canvas.toDataURL('image/png');

			// 새 탭에서 이미지 열기
			window.open(pngDataUrl, '_blank');
		};

		img.onerror = (error) => {
			console.error(
				'SVG를 이미지로 로드하는 중 오류가 발생했습니다:',
				error
			);
		};

		img.src = svgData;
	};

	return (
		<Panel position="top-right">
			<button className="download-btn" onClick={onClick}>
				이미지 보기
			</button>
		</Panel>
	);
};

export default DownloadButton;
