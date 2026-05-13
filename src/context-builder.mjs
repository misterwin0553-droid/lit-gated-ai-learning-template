import { canReadLayer, canRunAiTask, taskLayers } from './access-policy.mjs';

export function buildRoleView(mission, role) {
  return mission.layers.map((layer) => {
    const readable = canReadLayer(role, layer.id);
    return {
      layerId: layer.id,
      label: layer.label,
      audience: layer.audience,
      status: readable ? 'unlocked' : 'locked',
      items: readable ? layer.items : layer.items.map((item) => ({
        id: item.id,
        title: item.title,
        body: '[locked by access policy]'
      }))
    };
  });
}

export function buildAiContext(mission, role, taskId) {
  const task = mission.aiTasks[taskId];
  if (!task) throw new Error(`Unknown AI task: ${taskId}`);

  const taskAllowedLayers = taskLayers(mission, taskId);
  const permitted = canRunAiTask(role, mission, taskId);
  const included = [];
  const denied = [];

  for (const layer of mission.layers) {
    if (!taskAllowedLayers.includes(layer.id)) continue;
    if (canReadLayer(role, layer.id)) {
      included.push({ layerId: layer.id, items: layer.items });
    } else {
      denied.push(layer.id);
    }
  }

  return {
    taskId,
    description: task.description,
    role,
    permitted,
    includedLayers: included.map((x) => x.layerId),
    deniedLayers: denied,
    context: included.flatMap((x) => x.items.map((item) => ({
      layerId: x.layerId,
      title: item.title,
      body: item.body
    })))
  };
}

export function buildAccessReport(mission, rolesToCheck, tasksToCheck) {
  return {
    missionId: mission.missionId,
    title: mission.title,
    generatedAt: new Date().toISOString(),
    roles: Object.fromEntries(rolesToCheck.map((role) => [role, buildRoleView(mission, role)])),
    aiTasks: Object.fromEntries(rolesToCheck.map((role) => [
      role,
      Object.fromEntries(tasksToCheck.map((taskId) => [taskId, buildAiContext(mission, role, taskId)]))
    ]))
  };
}
