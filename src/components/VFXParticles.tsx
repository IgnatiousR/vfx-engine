import { useMemo, useRef } from "react";
import { PlaneGeometry } from "three";
import { InstancedMesh } from "three";

type VFXParticlesProps = {
  settings?: {
    nbParticles?: number;
  };
};

export const VFXParticles = ({ settings }: VFXParticlesProps) => {
  const { nbParticles = 1000 } = settings ?? {};
  const mesh = useRef<InstancedMesh | null>(null);
  const defaultGeometry = useMemo(() => new PlaneGeometry(0.5, 0.5), []);

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
