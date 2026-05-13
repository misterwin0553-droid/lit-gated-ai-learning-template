export const roles = {
  public_learner: {
    label: 'Public learner',
    layers: ['public']
  },
  student: {
    label: 'Authorized student',
    layers: ['public', 'student']
  },
  teacher: {
    label: 'Teacher / reviewer',
    layers: ['public', 'student', 'teacher']
  },
  owner: {
    label: 'Creator / owner',
    layers: ['public', 'student', 'teacher', 'source']
  }
};

export function canReadLayer(role, layerId) {
  const entry = roles[role];
  return Boolean(entry?.layers.includes(layerId));
}

export function allowedLayersForRole(role) {
  return roles[role]?.layers ?? [];
}

export function taskLayers(mission, taskId) {
  return mission.aiTasks?.[taskId]?.allowedLayers ?? [];
}

export function canRunAiTask(role, mission, taskId) {
  const allowedByRole = new Set(allowedLayersForRole(role));
  return taskLayers(mission, taskId).every((layer) => allowedByRole.has(layer));
}
