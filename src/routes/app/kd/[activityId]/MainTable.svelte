<script lang="ts">
  import { VirtualList } from 'svelte-virtuallists';
  import { tableData } from './maintabledata.svelte';

  let DEVMODE = $state(true);
  let compactTable = $state(false);



  function handleKeyDown(evt: { key: string }) {
    // Note number
    const key = parseInt(evt.key);
    if (!isNaN(key) && key >= 0 && key <= Math.min(9, statusList.length)) {
      console.log("Keydown", key, tableData.rowfocus);

      if (key === 0) {
        tableData.rows[tableData.rowfocus].assignedStatus = "";
      } else {
        tableData.rows[tableData.rowfocus].assignedStatus = statusList[key-1];
      }
      // console.log("CODE PRESSED: ", parseInt(evt.key), rowToDisplay[rowfocus].testStatus);
      return;
    }
  }

  const statusList = [
    "1. Khẩu trang",
    "2. Không mặt",
    "3. Không/sai banner",
    "4. Sai checkin",
    "5. Không checkin",
    "6. Photoshop",
    "7. Khác"
  ];
</script>

  <!-- head -->
<svelte:window onkeydown={handleKeyDown} />


<VirtualList items={tableData.rows} isTable={true}>
  {#snippet header()}
    <thead class="sticky top-0 z-10 bg-base-300 w-full">
      <tr>
        <th class="text-center" style="border-top-left-radius: 0.25rem;">STT</th>
        <th>Name</th>
        <th>MSSV</th>
        {#if tableData.rows.at(0)?.Faculty !== undefined && !compactTable}
          <th>Trường/Viện</th>
        {/if}
        <th>Status</th>

        {#if DEVMODE}
          <th class="text-center">Xác nhận</th>
          <th>Note</th>
        {/if}
      </tr>
    </thead>
  {/snippet}

  {#snippet vl_slot({ item, index })}
    <tr>
      <td class="text-center">{(index as number) + 1}</td>
      <td class="long-ass-col"><div>{item.FullName}</div></td>
      <td>{item.UserCode}</td>

      {#if item.Faculty !== undefined && !compactTable}
        <td class="long-ass-col"><div>{item.Faculty}</div></td>
      {/if}

      <td class="min-w-32">    
        {#if item.UAStatus === 2}
          <div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-success">
            Xác nhận
          </div>
        {:else if item.UAStatus === 1}
          <div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-warning">
            Chờ phê duyệt
          </div>
        {:else}
          <div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-error">
            Bị từ chối
          </div>
        {/if}
      </td>

      {#if DEVMODE}
      <td class="text-center">
        <input type="checkbox" class="checkbox checkbox-success"
          checked={item.UAStatus === 2}
          onchange={(e) => { item.UAStatus = (e.currentTarget.checked ? 2 : 1); } }
        />
      </td>

      <td class="text-center">
        <!-- Select status -->
        <select class="select select-bordered select-xs min-w-24 select-arrow"
          onchange={(e) => item.assignedStatus = e.currentTarget.value}
          value={item.assignedStatus} >


          <option value="" selected>OK</option>
          {#each statusList as value}
            <option {value}>{value}</option>
          {/each}
        </select>
      </td>
      {/if}
    </tr>
  {/snippet}
</VirtualList>

<style>
  :global(table) {
    @apply w-full table table-xs;
  }

  .long-ass-col {
    max-width: 8vw;
  }

  .long-ass-col div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style>