<template>
    <div class="group-list">
      <h3 class="text-lg font-semibold mb-4">Groups</h3>
      <div class="space-y-2">
        <div 
          v-for="group in groups" 
          :key="group.id"
          class="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-primary/10': selectedGroup === group.name }"
          @click="selectGroup(group.name)"
        >
          <span>{{ group.name }}</span>
          <button 
            @click.stop="deleteGroup(group.id)"
            class="text-red-500 hover:text-red-700"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GroupList',
    props: {
      selectedGroup: String
    },
    data() {
      return {
        groups: []
      }
    },
    methods: {
      async fetchGroups() {
        try {
          const response = await fetch('/api/schedule/groups');
          if (!response.ok) throw new Error('Failed to fetch groups');
          this.groups = await response.json();
        } catch (err) {
          this.$emit('error', 'Failed to load groups');
        }
      },
      selectGroup(groupName) {
        this.$emit('group-selected', groupName);
      },
      async deleteGroup(groupId) {
        try {
          const response = await fetch(`/api/schedule/groups/${groupId}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Failed to delete group');
          await this.fetchGroups();
        } catch (err) {
          this.$emit('error', 'Failed to delete group');
        }
      }
    },
    mounted() {
      this.fetchGroups();
    }
  }
  </script>