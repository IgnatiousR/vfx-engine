import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  InstancedMesh,
  DynamicDrawUsage,
  Euler,
  Matrix4,
  PlaneGeometry,
  Quaternion,
  Vector3,
  MathUtils,
} from "three";

type VFXParticlesProps = {
  settings?: {
    nbParticles?: number;
  };
};

const tmpPosition = new Vector3();
const tmpRotationEuler = new Euler();
const tmpRotation = new Quaternion();
const tmpScale = new Vector3(1, 1, 1);
const tmpMatrix = new Matrix4();
const tmpColor = new Color();

export const VFXParticles = ({ settings }: VFXParticlesProps) => {
  const { nbParticles = 1000 } = settings ?? {};
  const mesh = useRef<InstancedMesh | null>(null);
  const defaultGeometry = useMemo(() => new PlaneGeometry(0.5, 0.5), []);

  const emit = (count: number) => {
    if (!mesh.current) return;

    for (let i = 0; i < count; i++) {
      const position: [number, number, number] = [
        MathUtils.randFloatSpread(5),
        MathUtils.randFloatSpread(5),
        MathUtils.randFloatSpread(5),
      ];

      const scale: [number, number, number] = [
        MathUtils.randFloatSpread(1),
        MathUtils.randFloatSpread(1),
        MathUtils.randFloatSpread(1),
      ];

      const rotation: [number, number, number] = [
        MathUtils.randFloatSpread(Math.PI),
        MathUtils.randFloatSpread(Math.PI),
        MathUtils.randFloatSpread(Math.PI),
      ];

      tmpPosition.set(...position);
      tmpRotationEuler.set(...rotation);
      tmpRotation.setFromEuler(tmpRotationEuler);
      tmpScale.set(...scale);
      tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale);
      mesh.current.setMatrixAt(i, tmpMatrix);
    }
  };

  useEffect(() => {
    emit(nbParticles);
  }, [nbParticles]);

  return (
    <>
      <instancedMesh
        args={[defaultGeometry, undefined, nbParticles]}
        ref={mesh}
      >
        <meshBasicMaterial color={"orange"} />
      </instancedMesh>
    </>
  );
};

const ParticlesMaterial = shaderMaterial(
  {
    color: new Color("white"),
  },
  // glsl
  `
    varying vec2 vUv;

    void main() {
    gl_position = projectionMatrix * modelViewMatrix * vec4(instanceMatrix * vec4(position, 1.0));
    vUv = uv;
    }
    `,

  // glsl
  `
    uniform vec3 color;
    varying vec2 vUv;

    void main() {
    gl_FragColor = vec4(color, 1.0);
    vUv = uv;
    }`,
);

extend({ ParticlesMaterial });
