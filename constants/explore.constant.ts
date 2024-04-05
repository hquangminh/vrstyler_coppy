export const filterFormats = [
  { key: 'glb', title: '.glb (STK Globe File)' },
  { key: 'fbx', title: '.fbx (Autodesk FBX)' },
  { key: '3ds', title: '.3ds (3ds Max)' },
  { key: 'max', title: '.max (3ds Max)' },
  { key: 'blend', title: '.blend (Blender)' },
  { key: 'obj', title: '.obj (OBJ wavefront)' },
  { key: 'c4d', title: '.c4d (Cinema 4D)' },
  { key: 'mb', title: '.mb (Maya)' },
  { key: 'ma', title: '.ma (Maya)' },
  { key: 'lwo', title: '.lwo (LightWave)' },
  { key: 'lxo', title: '.lxo (Modo)' },
  { key: 'skp', title: '.skp (SketchUp)' },
  { key: 'stl', title: '.stl (Stereolithography)' },
  { key: 'unity', title: '.unitypackage (Unity)' },
  { key: 'uasset', title: '.uasset (Unreal)' },
  { key: 'dae', title: '.dae (Collada)' },
  { key: 'ply', title: '.ply (Polygon File Format)' },
  { key: 'goz', title: '.goz' },
  { key: 'spp', title: '.spp' },
  { key: 'gltf', title: '.gltf' },
];

export const filterLicenses = [
  { key: 'standard', title: 'Standard' },
  { key: 'editorial', title: 'Editorial' },
];

export const filterSort = (langLabel: Record<string, string>) => [
  { key: 'relevance', title: langLabel.explore_filter_relevance || 'Relevance', isFree: false },
  { key: 'best-selling', title: langLabel.explore_filter_best_selling, isFree: false },
  { key: 'newest', title: langLabel.explore_filter_newest || 'Newest', isFree: false },
  { key: 'oldest', title: langLabel.explore_filter_oldest || 'Oldest', isFree: false },
  { key: 'lower-price', title: langLabel.explore_filter_lower || 'Lower price', isFree: true },
  { key: 'higher-price', title: langLabel.explore_filter_higher || 'Higher price', isFree: true },
];

export const filterSortFreeModels = [
  { key: 'relevance', title: 'Relevance' },
  { key: 'newest', title: 'Newest' },
  { key: 'oldest', title: 'Oldest' },
];

export const filterOther = (langLabel: Record<string, string>) => [
  { key: 'animated', title: langLabel.export_filter_animated || 'Animated' },
  { key: 'rigged', title: langLabel.export_filter_rigged || 'Rigged' },
  { key: 'pbr', title: 'PBR' },
];
