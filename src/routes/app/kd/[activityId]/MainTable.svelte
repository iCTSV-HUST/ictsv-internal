<script lang="ts">
  import { VirtualList } from 'svelte-virtuallists';
  import { tableData } from './maintabledata.svelte';
  import { setStatus, Status } from './changeStatus';

  let {
    editable = false,
  }: {
    editable?: boolean
  } = $props();

  let compactTable = $state(false);

  function handleKeyDown(evt: { key: string; preventDefault: () => void; }) {
    // Note number

    // Up, Down
    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
      evt.preventDefault();

      if (evt.key === 'ArrowUp') {
        tableData.focusUp();
      } else if (evt.key === 'ArrowDown') {
        tableData.focusDown();
      }

      console.log(tableData.currentRow.UserCode);
      const element = document.getElementById(`checkbox-${tableData.currentRow.UserCode}`);
      element?.focus();
      element?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
      return;
    }

    const key = parseInt(evt.key);
    if (!isNaN(key) && key >= 0 && key <= Math.min(9, statusList.length)) {
      // console.log("Keydown", key, tableData.rowfocus);

      if (key === 0) {
        tableData.currentRow.assignedStatus = "";

      } else {
        tableData.currentRow.assignedStatus = statusList[key-1];
      }
      console.log("TESTING")
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


<VirtualList items={tableData.displayRows} isTable={true}>
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

        {#if editable}
          <th class="text-center">Xác nhận</th>
          <th>Note</th>
        {/if}
      </tr>
    </thead>
  {/snippet}

  {#snippet vl_slot({ item })}
    <tr id={`row-${item.UserCode}`}

      onfocus={() => tableData.rowfocus = item.index} 
      onmouseover={() => tableData.rowfocus = item.index}
      class:active={tableData.rowfocus === item.index}

      class:error-down-img={item.imageAsset === ""}
      class:error-down-checkin={item.coords?.length == 0}>

      <td class="text-center">{item.index + 1}</td>
      <td class="long-ass-col" title={item.FullName}><div>{item.FullName}</div></td>
      <td>{item.UserCode}</td>

      {#if item.Faculty !== undefined && !compactTable}
        <td class="long-ass-col"><div>{item.Faculty}</div></td>
      {/if}

      <td class="min-w-32">    
        {#if item.UAStatus === Status.APPROVED}
          <div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-success">
            Xác nhận
          </div>
        {:else if item.UAStatus === Status.PENDING}
          <div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-warning">
            Chờ phê duyệt
          </div>
        {:else}
          <div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-error">
            Bị từ chối
          </div>
        {/if}
      </td>

      {#if editable}
      <td class="text-center">
        <input id={`checkbox-${item.UserCode}`} type="checkbox" 
          class="checkbox checkbox-success"
          checked={item.UAStatus === Status.APPROVED}
          onchange={(e) => { 
            const toChange = e.currentTarget.checked ? Status.APPROVED : Status.PENDING;
            tableData.rows[item.index].UAStatus = toChange;
            if (editable) {
              setStatus(item.UserCode, toChange);
            }
          } }
        />
      </td>

      <td class="text-center">
        <!-- Select status -->
        <select class="select select-bordered select-xs min-w-24 select-arrow"
          onchange={(e) => tableData.rows[item.index].assignedStatus = e.currentTarget.value}
          value={item.assignedStatus ?? ""} >


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