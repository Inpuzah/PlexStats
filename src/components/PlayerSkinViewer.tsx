'use client';

import { useEffect, useRef, useState } from 'react';

type PlayerSkinViewerProps = {
  skinUrl: string;
  username: string;
  uuid: string;
};

// Camera positioning settings
const CAMERA_SETTINGS = {
  zoom: 0.65,        // Lower = zoomed out, Higher = zoomed in
  fov: 40,           // Field of view angle
  targetX: 0,        // Camera target X position
  targetY: 0,       // Camera target Y position (vertical: higher = look down more)
  targetZ: 0,        // Camera target Z position
  // Orbital camera settings (for initial view angle around the model)
  orbitDistance: 60, // Distance from model center
  orbitTheta: 90,  // Horizontal rotation (0 = front, slightly right)
  orbitPhi: 1.5,     // Vertical rotation (tilted up slightly from horizontal)
};

export default function PlayerSkinViewer({ skinUrl, username }: PlayerSkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    console.log('[PlayerSkinViewer] Effect running. skinUrl:', skinUrl, 'username:', username, 'canvas:', !!canvas, 'container:', !!container, 'containerWidth:', container?.clientWidth);

    if (!canvas || !container) {
      console.log('[PlayerSkinViewer] Missing canvas or container');
      return;
    }

    if (!skinUrl) {
      console.log('[PlayerSkinViewer] No skinUrl provided');
      setError('No skin URL provided');
      return;
    }

    let disposed = false;
    let viewer: any = null;

    const init = async () => {
      try {
        setError(null);

        console.log('[PlayerSkinViewer] Starting init...');
        console.log('[PlayerSkinViewer] Canvas size:', { width: canvas.width, height: canvas.height });
        console.log('[PlayerSkinViewer] Container size:', { width: container.clientWidth, height: container.clientHeight });

        // Small delay to ensure layout is settled
        await new Promise(resolve => setTimeout(resolve, 100));

        const { SkinViewer } = await import('skinview3d');
        console.log('[PlayerSkinViewer] SkinViewer imported successfully');

        if (disposed) {
          console.log('[PlayerSkinViewer] Disposed before viewer creation');
          return;
        }

        const viewerWidth = Math.max(320, container.clientWidth);
        console.log('[PlayerSkinViewer] Creating viewer with width:', viewerWidth, 'height: 420');

        viewer = new SkinViewer({
          canvas,
          width: viewerWidth,
          height: 420
        });
        console.log('[PlayerSkinViewer] SkinViewer instance created successfully');

        viewer.zoom = CAMERA_SETTINGS.zoom;
        viewer.fov = CAMERA_SETTINGS.fov;
        viewer.autoRotate = false;
        viewer.controls.enablePan = false;
        viewer.controls.enableZoom = true;
        viewer.controls.enableRotate = true;
        viewer.controls.target.set(CAMERA_SETTINGS.targetX, CAMERA_SETTINGS.targetY, CAMERA_SETTINGS.targetZ);

        // Set orbital camera position
        const theta = CAMERA_SETTINGS.orbitTheta;
        const phi = CAMERA_SETTINGS.orbitPhi;
        const dist = CAMERA_SETTINGS.orbitDistance;
        const x = dist * Math.sin(phi) * Math.cos(theta);
        const y = dist * Math.cos(phi);
        const z = dist * Math.sin(phi) * Math.sin(theta);
        viewer.camera.position.set(x, y, z);

        console.log('[PlayerSkinViewer] Loading skin from:', skinUrl);

        await viewer.loadSkin(skinUrl);
        console.log('[PlayerSkinViewer] Skin loaded successfully');

        const playerObject = viewer.playerObject as any;
        if (playerObject.leftArm?.rotation) playerObject.leftArm.rotation.z = -0.32;
        if (playerObject.rightArm?.rotation) playerObject.rightArm.rotation.z = 0.32;
        if (playerObject.leftLeg?.rotation) playerObject.leftLeg.rotation.z = -0.08;
        if (playerObject.rightLeg?.rotation) playerObject.rightLeg.rotation.z = 0.08;
        console.log('[PlayerSkinViewer] Pose applied successfully');
      } catch (err) {
        console.error('[PlayerSkinViewer] Error during init:', err);
        if (!disposed) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.error('[PlayerSkinViewer] Setting error state to:', errorMsg);
          setError(errorMsg);
        }
      }
    };

    const handleResize = () => {
      if (viewer && containerRef.current) {
        viewer.width = Math.max(320, containerRef.current.clientWidth);
        viewer.height = 420;
      }
    };

    void init();
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      viewer?.dispose();
    };
  }, [skinUrl]);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="h-[420px] w-full rounded-xl border border-zinc-200/80"
        style={{ display: 'block' }}
      />
      {error && (
        <div className="absolute left-3 top-3 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
