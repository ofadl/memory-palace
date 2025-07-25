import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import axios from 'axios';
import './App.css';

function MemoryItem({ position, color, concept, description, object, onClick }) {
  console.log('MemoryItem object type:', object); // Debug log
  
  // Create different geometry based on object type
  const renderGeometry = () => {
    switch(object?.toLowerCase()) {
      case 'sphere':
        return <sphereGeometry args={[0.8, 16, 16]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.6, 0.6, 1.2, 8]} />;
      case 'cone':
        return <coneGeometry args={[0.8, 1.5, 8]} />;
      case 'pyramid':
        return <coneGeometry args={[0.8, 1.5, 4]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh position={position} onClick={() => onClick(concept, description)}>
      {renderGeometry()}
      <meshStandardMaterial color={color} />
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {concept}
      </Text>
    </mesh>
  );
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 5, -10]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
    </group>
  );
}

function App() {
  const [memoryItems, setMemoryItems] = useState([]);
  const [inputContent, setInputContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = async () => {
    if (!inputContent.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await axios.post('http://localhost:3001/api/analyze-content', {
        content: inputContent
      });
      
      setMemoryItems(response.data.memoryObjects);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Updated click handler
  const handleItemClick = (concept, description) => {
    alert(`Concept: ${concept}\n\nDescription: ${description}`);
  };

  return (
    <div className="App">
      <div className="ui-panel">
        <h2>Memory Palace</h2>
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Enter content to memorize..."
          rows={4}
          cols={30}
        />
        <br />
        <button onClick={analyzeContent} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Create Memory Palace'}
        </button>
        <div>Items: {memoryItems.length}</div>
      </div>
      
      <Canvas camera={{ position: [0, 2, 5] }}>
        <Room />
        {memoryItems.map((item, index) => (
          <MemoryItem
            key={index}
            position={item.position}
            color={item.color}
            concept={item.concept}
            description={item.description}
            object={item.object}
            onClick={handleItemClick}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;