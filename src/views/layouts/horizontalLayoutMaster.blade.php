<body
  class="{{$configData['mainLayoutTypeClass']}} @if(!empty($configData['bodyCustomClass']) && isset($configData['bodyCustomClass'])) {{$configData['bodyCustomClass']}} @endif"
  data-open="click" data-menu="horizontal-menu" data-col="2-columns">

  <!-- BEGIN: Header-->
  <header class="page-topbar" id="header">
    @include('mie-ui::panels.horizontalNavbar')
  </header>
  <!-- BEGIN: SideNav-->
  @include('mie-ui::panels.sidebar')
  <!-- END: SideNav-->

  <!-- BEGIN: Page Main-->
  <div id="main">
    <div class="row">
      @if($configData["navbarLarge"] === true && isset($configData["navbarLarge"]))
      {{-- navabar large  --}}
      <div class="content-wrapper-before {{$configData["navbarLargeColor"]}}"></div>
      @endif

      @if ($configData["pageHeader"] === true && isset($breadcrumbs))
      {{-- breadcrumb --}}
      @include('mie-ui::panels.breadcrumb')
      @endif
      <div class="col s12">
        <div class="container">
          {{-- main page content  --}}
          @yield('content')
          {{-- right sidebar  --}}
          @include('mie-ui::pages.sidebar.right-sidebar')
        </div>
        {{-- overlay --}}
        <div class="content-overlay"></div>
      </div>
    </div>
  </div>

  <!-- END: Page Main-->

  {{-- main footer  --}}
  @include('mie-ui::panels.footer')

  {{-- vendors and page scripts file   --}}
  @include('mie-ui::panels.scripts')
</body>
