import { Environment, OrbitControls, Stats } from "@react-three/drei";
import { VFXParticles } from "./VFXParticles";

export const Experience = () => {
  return (
    <>
      <Stats />
      <OrbitControls enablePan={false} />
      <Environment preset="sunset" />
      <VFXParticles />
    </>
  );
};
