import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import React from "react";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
// function Banana({ ...props }) {
//   const { scene } = useGLTF("/public/banana-v1.glb");

//   const group = React.useRef();
//   const { nodes, materials } = useGLTF("/banana-v1-transformed.glb");
//   return (
//     <group ref={group} {...props} dispose={null}>
//       <mesh
//         geometry={nodes.banana.geometry}
//         material={materials.skin}
//         material-emissive="orange"
//         rotation={[4.51, 0.08, -2.98]}
//       />
//     </group>
//   );
// }
function Banana({ z }) {
  const ref = React.useRef();

  const { nodes, materials } = useGLTF("/banana-v1-transformed.glb");

  const [click, setClick] = React.useState(false);
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);
  const [data] = React.useState({
    x: THREE.MathUtils.randFloatSpread(3),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });
  useFrame((state) => {
    // ref.current.position.x = Math.sin(state.clock.elapsedTime) * 3;
    // ref.current.position.y = Math.sin(state.clock.elapsedTime) * 3;
    // ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 3;
    // ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 3;
    // ref.current.position.z = THREE.MathUtils.lerp(
    //   ref.current.position.z,
    //   click ? -5 : 0,
    //   0.2
    // );
    ref.current.rotation.set(
      (data.rX += 0.001),
      (data.rY += 0.001),
      (data.rZ += 0.002)
    );
    ref.current.position.set(data.x * width, (data.y += 0.025), z);
    if (ref.current.position.y > height) {
      data.y = -height;
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={nodes.banana.geometry}
      material={materials.skin}
      material-emissive="orange"
      rotation={[4.51, 0.08, -2.98]}
    />
  );
}

function App({ count = 100, depth = 80 }) {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
      <color attach="background" args={["#ffbf40"]} />
      <spotLight position={[10, 10, 10]} intensity={1} />
      <React.Suspense fallback={null}>
        <Environment preset="sunset" />
        {Array.from({ length: count }).map((_, i) => (
          <Banana key={i} z={-(i / count) * depth - 20} scale={-1.25} />
        ))}
        <EffectComposer>
          <DepthOfField
            target={[0, 0, depth / 2]}
            focalLength={0.5}
            bokehScale={11}
            height={700}
          />
        </EffectComposer>
      </React.Suspense>
    </Canvas>
  );
}

export default App;
