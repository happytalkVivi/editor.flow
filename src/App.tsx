// src/App.tsx
import React, { useCallback, useRef } from 'react';
import {
	ReactFlow,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import DownloadButton from './components/view';

const initialNodes = [
	{ id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
	{ id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
	{ id: '3', position: { x: 200, y: 200 }, data: { label: '3' } },
];
const initialEdges = [
	{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
];

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	return (
		<div style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
			>
				<Controls />
				<MiniMap />
				<Background variant={'dots'} gap={12} size={1} />
				<DownloadButton reactFlowWrapper={reactFlowWrapper} />
			</ReactFlow>
		</div>
	);
}
