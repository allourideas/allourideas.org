export class YpIronListHelpers {

  static attachListeners(baseElement: YpElementWithIronList) {
    baseElement.resetListSize = () => {
      const ironListId = "#ironList";
      const list = baseElement.$$(ironListId) as IronListInterface;
      if (list) {
        const skipHeight = true;
        const windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;
        if (list) {
          let height;
          if (baseElement.wide) {
            height = windowHeight - 415;
          } else {
            height = windowHeight - 300;
            windowWidth = windowWidth - 16;
          }

          if (!skipHeight) {
            list.style.height = height + 'px';
          }

          if (!baseElement.skipIronListWidth) {
            list.style.width = windowWidth + 'px';
          } else {
            console.log("Skipping setting iron-list width");
          }
          list.updateViewportBoundaries();
          setTimeout(() => {
            list.notifyResize();
          })
        }
      } else {
        console.warn("Can't find list to setup for size resize");
      }
    };
    window.addEventListener("resize", baseElement.resetListSize);
    baseElement.resetListSize(new CustomEvent("resize"));
  }

  static detachListeners(baseElement: YpElementWithIronList) {
    if (baseElement.resetListSize) {
      window.removeEventListener("resize", baseElement.resetListSize);
    }
  }
}
