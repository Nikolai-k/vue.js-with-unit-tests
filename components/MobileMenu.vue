<template>
  <div
    class="mobile-menu-container"
    @click.prevent.self="onMenuBackLayerClick"
  >
    <ul class="site-navigation">
      <div
        :class="{'site-navigation__go-back--disabled': history.length === 1}"
        class="site-navigation__go-back"
        @click="onBackBtnClick"
      >
        <span class="site-navigation__arrow site-navigation__arrow-left" />
      </div>
      <div
        v-for="m in Object.keys(menuModel)"
        :key="m"
        :class="{'site-navigation__active': m == currentMenuShowed}"
        class="site-navigation__layer"
      >
        <li
          v-for="menuItem in menuModel[m]"
          :key="menuItem.id"
          class="site-navigation__item"
          @click="onMenuItemClick(menuItem)"
        >
          <a
            class="site-navigation__link"
            :href="menuItem.submenu ? 'javascript:void(0)' : getLinkHref(menuItem)"
          >
            {{ menuItem.name }}
            <span v-if="menuItem.submenu" class="site-navigation__arrow site-navigation__arrow-right" />
          </a>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    menu() {
      return this.$store.state.the_menu.menu;
    },
  },
  data() {
    return {
      menuModel: [],
      currentMenuShowed: 'root',
      history: ['root'],
    };
  },
  methods: {
    _setMenuModel() {
      const menuObj = this.menu;

      const res = {};
      const buildMenu = (menuArr, index, prevDest, prevElementSlug) => {
        menuArr.forEach((el, i) => {
          let dest = '';

          if (index === undefined) {
            dest = 'root';
          } else {
            dest = prevDest;
          }

          if (!res[dest]) res[dest] = [];
          res[dest].push(el);

          if (prevElementSlug !== undefined) {
            if (el.prevElementSlug === undefined) el.prevElementSlug = '';
            el.prevElementSlug = prevElementSlug;
          }

          if (el.submenu) {
            if (dest === 'root') {
              prevDest = i;
            }
            const nextDest = `${prevDest}-${i}`;
            el.to = nextDest;

            if (!prevElementSlug) prevElementSlug = '';

            const psval = `${prevElementSlug}/${el.slug}`;
            buildMenu(el.submenu, i, nextDest, psval);
          }
        });
      };
      buildMenu(menuObj);
      this.menuModel = res;
    },
    onMenuItemClick(menuItem) {
      if (!menuItem.submenu) {
        const href = this.getLinkHref(menuItem);
        window.location.href = href;
      } else {
        this.currentMenuShowed = menuItem.to;
        this.history.push(menuItem.to);
      }
    },
    onBackBtnClick() {
      if (this.history.length === 1) return;
      this.history.pop();
      this.currentMenuShowed = this.history[this.history.length - 1];
    },
    onMenuBackLayerClick() {
      this.$store.commit('the_menu/SET_MENU_VISIBLE', false);
    },
    getLinkHref(menuItem) {
      return `https://gdematerial.ru/catalog${menuItem.prevElementSlug}/${menuItem.slug}`;
    },
  },
  mounted() {
    this._setMenuModel();
  },
};
</script>


<style lang="scss">

.mobile-menu-container{
  position: absolute;
  width: 100%;
  z-index: 99;
  box-shadow: 3px 3px 5px 6px #ccc;
}

.site-navigation {
  display: flex;
  flex-direction: column;
  grid-area: site-navigation;
  list-style-type: none;
  width: 100%;
  height: calc(100vh - 153px);
  background: rgb(255, 255, 255);
  overflow-y: scroll;
  z-index: 1;
  padding-left: 0;
  position: relative;
  // display: none;

  &__arrow {
    display: inline-block;
    border-top: 2px solid #000;
    border-right: 2px solid #000;
    position: absolute;
    border-color: gray;
    &-right{
      transform: rotate(45deg);
      right: 30px;
      top: calc(50% - 5px);
      height: 10px;
      width: 10px;
    }
    &-left{
      transform: rotate(-135deg);
      top: calc(50% - 7px);
      right: 5px;
      left: 1rem;
      height: 14px;
      width: 14px;
      border-color: black;
    }
  }

  &__layer{
    top: 47px;
    transition: 0.3s ease-in-out;
    display: none;
    display: block;
    width: 100%;
    opacity: 0;
    height: 0;
    position: absolute;
    right: 100%;
  }

  &__active{
    display: block;
    opacity: 1;
    height: inherit;
    position: absolute;
    right: 0%;
  }

  &__item {
    display: block;
    width: 100%;
    height: 47px;
    position: relative;
    color: #333;
    padding: .75rem 1rem;

    &:hover,
    &:active {
      background-color: rgb(130, 0, 255);
      color: rgb(255, 255, 255);
    }
  }

  &__grid {
    display: grid;
    grid-template-rows: 90px 90px;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    list-style-type: none;
    padding: 0;
  }

  &__grid-item {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
    text-align: center;
    color: rgb(130, 0, 255);
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  &__link {
    display: block;
    width: 100%;
    color: inherit;

    &:hover,
    &:active {
      color: rgb(255, 255, 255);
    }

    &--special {
      display: flex;
      align-items: center;
      position: absolute;
      padding-left: 50%;
      left: -10%;
      height: 100%;

      &:hover,
      &:active {
        color: inherit;
      }
    }
  }

  &__go-back{
    position: absolute;
    height: 47px;
    width: 100%;
    cursor: pointer;
    &:hover{
      background: #ccc;
    }
    &--disabled{
      .site-navigation__arrow-left{
        border-color: gray;
      }
      &:hover{
        background: none;
        cursor: default;
      }
    }
  }
}
</style>
